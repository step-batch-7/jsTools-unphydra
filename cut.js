const fs = require("fs");
const { stdin } = process;
const performCut = require("./src/performCut");

const main = function() {
  const showOutput = function(cutOutput) {
    cutOutput.cutLine && console.log(cutOutput.cutLine);
    cutOutput.errorLine && console.error(cutOutput.errorLine);
  };
  const myFs = { fileReader: fs.readFile, fileExists: fs.existsSync };
  performCut(myFs, process.argv, showOutput, stdin);
};

main();
