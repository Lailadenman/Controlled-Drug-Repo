//const {stream, data} = require("./read-csv");
const fs = require('browserify-fs');
const parse = require('csv-parse')

//console.log(data, "line 97");
const reports = [];

let transactionNum = 0

const newTransactionNum = () => {
    transactionNum++;
    return transactionNum.toString().padStart(6, '0');
}

const licenseNums = {
    "Dr. Weston Richter": "7401",
    "Dr. Dan Slaton": "15324",
    "Dr. Matt Lockhart": "22593",
    "Dr. Jon Mendoza": "23442",
    "Dr. Andrea Richter": "21142",
    "Dr. Mathew Cohen": "23469",
    "Dr. Matthew Goss": "22990"
}

const drugUnit = {
    "10702-055-01": "01",
    "60432-455-16": "02",
    "51293-625-10": "01",
    "51293-626-10": "01",
    "51293-627-10": "01",
    "51293-628-10": "01",
    "65162-627-50": "01",
    "0172-3925-60": "01",
    "0172-3926-60": "01",
    "0172-3927-60": "01"
}

const makeHeader = (transNum) => {
    const today = new Date();
    const todayDate = today.getDate().toString().padStart(2, '0');
    const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const todayYear = today.getFullYear();
    const todayHours = today.getHours().toString().padStart(2, '0');
    const todayMinutes = today.getMinutes().toString().padStart(2, '0');

    const header = `TH*4.1*${transNum}***${todayYear}${todayMonth}${todayDate}*${todayHours}${todayMinutes}*P**~~IS*8187849977*Sherman Oaks Veterinary Group**~PHA***${"AR1166520"}*${"Dr. Weston Richter"}******8187849977*${licenseNums["Dr. Weston Richter"]}**~`;

    return header;
}

const makeBody = (obj) => {
    // clean up first and last name into one line
    const clientName = obj['Client Name'].split(",");
    const [first, last] = clientName;
    //const first = 'test';
    //const last = 'test';

    //const [first, last] = data["Client Name"].split(",");
    //clean up address lines into one line
    const address = obj.Address.split(',');
    //const [firstLine, secondLine, unUsed, thirdLine] = address;
    let firstLine = address[0].trim();
    if(address.length > 4) {
        firstLine += address[1]
    }
    const secondLine = address[address.length - 3].trim();
    let thirdLine = address[address.length - 1].trim();

    //clean up DOB
    const bDate = obj["Patient D.O.B."].split("-");
    const [bMonth, bDay, bYear] = bDate;
    //const bYear = bDate[2];
    //const bMonth = bDate[0];
    //const bDay = bDate[1];

    //clean up Med Date
    const fullDate = obj["Medication Timestamp"].split(' ');
    const date = fullDate[0].split('-');
    const [medMonth, medDay, medYear] = date;
    //const medYear = date[2];
    //const medMonth = date[0];
    //const medDay = date[1];

    const productId = obj['Product Identifier'];

    const patSex = obj["Patient Sex"];

    if(!patSex) {

    }

    const body = `PAT*******${first.trim()}*${last.trim()}****${firstLine}**${secondLine}*CA*${thirdLine}**${bYear}${bMonth}${bDay}*${patSex}*02***${obj["Patient Name"]}*~DSP*00*${obj["Prescription No."]}*${medYear}${medMonth}${medDay}*0*${medYear}${medMonth}${medDay}*0*01*${obj['Product Identifier']}*${obj.Dispensed.split(".")[0].slice(1)}*ENTER DAY SUPPLY HERE*${drugUnit[productId]}*01*02***01****~PRE**${obj["DEA Reg No."]}******~`

    return body;
}

const makeFooter = (transNum) => {
    const footer = `TP*ENTER NUM OF TILDES (~) - 4*~TT*${transNum}*ENTER NUM OF TILDES (~) - 1*~`

    return footer;
}

function createLog(dataArr){
    //stream;
    const transNum = newTransactionNum();

    let log = makeHeader(transNum);

    //console.log(Array.isArray(dataArr))

    if(Array.isArray(dataArr)) {
        for (let i = 0; i < dataArr.length; i++) {
            let ele = dataArr[i];
            log += makeBody(ele);
        };
    }

    log += makeFooter(transNum);

    let newLog = {};

    newLog[transNum] = log;

    return log;
}

const getCSVData = (fileName) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream('./Controlled-Drug-Report (21).csv')
            .pipe(
                parse({
                    skip_empty_lines: true,
                    delimiter: ",",
                    //from_line: 2,
                    columns: true,
                    ltrim: true
                }))
            .on("data", function (row) {
                data.push(row);
                //console.log(data, "Line 20");
            })
            .on("error", function (err) {
                reject(err)
            })
            .on("end", function () {
                console.log("parsed csv data:");

                log = createLog(data);

                resolve(log);

                console.log(log, "end");

                // console.log("finished");

            });
    })

}

getCSVData();

export default {
    getCSVData
}

const newLog = createLog()
reports.push(newLog)
//console.log(newLog)

// module.exports = {
//     makeHeader,
//     makeBody,
//     makeFooter,
//     createLog,
//     reports
// }
