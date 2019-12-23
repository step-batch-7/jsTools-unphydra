const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutOperation = function(error, data) {
  if (error) {
    throw new error(`cut: ${this.path}: No such file or directory`);
  }
  const listOfLines = data.split("\n").slice(0, -1);
  const listOfCutLines = getCutLines(listOfLines, this);
  const result = generateCutMessage(listOfCutLines);
  console.log(result);
};
const performCut = function(fs, args) {
  const parsedValue = parser(args);
  fs.fileReader(
    parsedValue.path,
    "utf8",
    performCutOperation.bind(parsedValue)
  );
};

module.exports = performCut;
