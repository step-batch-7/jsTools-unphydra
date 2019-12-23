const fs = require("fs");
const performCut = require("./src/sudoCut");

const main = function() {
  const myFs = { fileReader: fs.readFile };
  performCut(myFs, process.argv);
};

main();
