const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutOperation = function(error, data) {
  if (error) {
    throw new error(`cut: ${this.path}: No such file or directory`);
  }
  const listOfLines = data.split("\n").slice(0, -1);
  const listOfCutLines = getCutLines(listOfLines, this.parsedValue);
  const result = generateCutMessage(listOfCutLines);
  this.printer.printContents(result);
};
const performCut = function(fs, args, printer) {
  const parsedValue = parser(args);
  const inst = { printer, parsedValue };
  fs.fileReader(parsedValue.path, "utf8", performCutOperation.bind(inst));
};

module.exports = performCut;
