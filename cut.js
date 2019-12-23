const fs = require("fs");
const { stdin } = process;
const performCut = require("./src/performCut");

const main = function() {
  const printer = {
    printContents: contents => {
      console.log(contents);
    },
    printError: message => {
      console.error(message);
    }
  };

  const myFs = { fileReader: fs.readFile, fileExists: fs.existsSync };
  performCut(myFs, process.argv, printer, stdin);
};

main();
