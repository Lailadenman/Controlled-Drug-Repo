// const fs = require('fs');
// const parse = require('csv-parse');
// import createLog from "./run";
import getCSVData from "./run.js";

const submitButton = document.querySelector("button");

//const file = new FormData();
//file.append("file", document.getElementById("user-email").value)

//const reports = [];
const data = [];

// IN USE

async function getData() {
    const file = document.querySelector("input");
    const fileName = file.value;

    console.log(fileName);

    const filePromise = getCSVData(fileName);
    const fileData = await filePromise;

    const dataP = document.createElement("p");
    dataP.innerText = fileData;
    document.body.appendChild(dataP);
}

// HERE
window.onload = () => {
    submitButton.addEventListener("click", getData)

    const dataP = document.createElement("p");
    dataP.innerText = "tester";
    document.body.appendChild(dataP);
}

// TO HERE WORKS PERFECTLY FINE

export default {
    // stream,
    data
};
