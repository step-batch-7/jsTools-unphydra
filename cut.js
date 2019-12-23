const fs = require("fs");
const {
  generateCutMessage,
  getCutLines,
  getListOfFileContents,
  parser
} = require("./src/optionLib");

const main = function() {
  const myFs = { fileReader: fs.readFileSync };
  const parsedValue = parser(process.argv);
  const fileContents = getListOfFileContents(
    myFs,
    parsedValue.path,
    "utf8"
  );
  const listOfCutLines = getCutLines(fileContents, parsedValue);
  const result = generateCutMessage(listOfCutLines);
  console.log(result);
};

main();
