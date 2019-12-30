const fs = require('fs');
const readline = require('readline');
const { performCut } = require('./src/performCut');

const readLine = readline.createInterface({
  input: process.stdin
});
readLine.pause();
const main = function () {
  const showOutput = function (cutOutput) {
    cutOutput.cutLine !== undefined &&
      process.stdout.write(cutOutput.cutLine);
    cutOutput.errorLine !== undefined &&
      process.stderr.write(cutOutput.errorLine + '\n');
    process.exitCode = cutOutput.exitCode;
  };
  performCut({fs, readLine}, process.argv, showOutput);
};

main();
