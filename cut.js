const fs = require("fs");
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

  const myFs = { fileReader: fs.readFile };
  performCut(myFs, process.argv, printer);
};

main();
