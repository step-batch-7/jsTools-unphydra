const fs = require("fs");
// const { stdin } = process;
const readline = require("readline");
const { performCut } = require("./src/performCut");

const rl = readline.createInterface({
  input: process.stdin
});
rl.pause();
const main = function() {
  const showOutput = function(cutOutput) {
    cutOutput.cutLine && console.log(cutOutput.cutLine);
    cutOutput.errorLine && console.error(cutOutput.errorLine);
  };
  const myFs = { fileReader: fs.readFile, fileExists: fs.existsSync };
  performCut(myFs, process.argv, showOutput, rl);
};

main();
