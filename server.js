const http = require('http');
const fs = require('fs');


http.createServer((req, res) => {
    if(req.method === "POST") {
        const htmlPage = fs.readFileSync("./contr")

        res.statusCode = 200;

    }
})
