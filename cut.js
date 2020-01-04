/* eslint-disable no-magic-numbers */
const fs = require('fs');
const readline = require('readline');
const {performCut} = require('./src/performCut');

const readLine = readline.createInterface({
  input: process.stdin
});
readLine.pause();
const main = function () {
  const showOutput = function (cutOutput) {
    cutOutput.cutLine !== undefined &&
      process.stdout.write(cutOutput.cutLine + '\n');
    cutOutput.errorLine !== undefined &&
      process.stderr.write(cutOutput.errorLine + '\n');
    process.exitCode = cutOutput.exitCode;
  };
  const args = process.argv.slice(2);
  performCut({fs, readLine}, args, showOutput);
};

main();
