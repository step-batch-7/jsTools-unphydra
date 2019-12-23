const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutOnReadFile = function(error, data) {
  const listOfLines = data.split("\n").slice(0, -1);
  const listOfCutLines = getCutLines(listOfLines, this.parsedValue);
  const result = generateCutMessage(listOfCutLines);
  this.printer.printContents(result);
};

const performCutOnStdin = function(inst, stdin) {
  stdin.setEncoding("utf8");
  stdin.on("data", data => {
    const listOfLines = data.split("\n").slice(0, -1);
    const listOfCutLines = getCutLines(listOfLines, inst.parsedValue);
    const result = generateCutMessage(listOfCutLines);
    inst.printer.printContents(result);
  });
};

const performCut = function(fs, args, printer, stdin) {
  const parsedValue = parser(args);
  const inst = { printer, parsedValue };
  if (!parsedValue.path) {
    performCutOnStdin(inst, stdin);
  } else {
    if (!fs.fileExists(parsedValue.path)) {
      printer.printError(
        `cut: ${parsedValue.path}: No such file or directory`
      );
      return;
    }
    fs.fileReader(
      parsedValue.path,
      "utf8",
      performCutOnReadFile.bind(inst)
    );
  }
};

module.exports = performCut;
