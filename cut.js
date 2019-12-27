const fs = require("fs");
const readline = require("readline");
const { performCut } = require("./src/performCut");

const readLine = readline.createInterface({
  input: process.stdin
});
readLine.pause();
const main = function() {
  const showOutput = function(cutOutput) {
    cutOutput.cutLine != undefined && console.log(cutOutput.cutLine);
    cutOutput.errorLine != undefined && console.error(cutOutput.errorLine);
    cutOutput.exitCode && process.exit(cutOutput.exitCode);
  };
  performCut(fs, process.argv, showOutput, readLine);
};

main();
