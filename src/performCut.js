const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutOnReadFile = function(showOutput, parsedValue) {
  return function(error, data) {
    const listOfLines = data.split("\n").slice(0, -1);
    const listOfCutLines = getCutLines(listOfLines, parsedValue);
    const cutLine = generateCutMessage(listOfCutLines);
    showOutput({ cutLine });
  };
};

const performCutOnStdin = function(inst, showOutput, stdin) {
  stdin.setEncoding("utf8");
  stdin.on("data", data => {
    const listOfLines = data.split("\n").slice(0, -1);
    const listOfCutLines = getCutLines(listOfLines, inst);
    const cutLine = generateCutMessage(listOfCutLines);
    showOutput({ cutLine });
  });
};

const performCut = function(fs, args, showOutput, stdin) {
  const parsedValue = parser(args);
  if (!parsedValue.path) {
    performCutOnStdin(parsedValue, showOutput, stdin);
  } else {
    if (!fs.fileExists(parsedValue.path)) {
      const errorLine = `cut: ${parsedValue.path}: No such file or directory`;
      showOutput({ errorLine });
      return;
    }
    const performCutAfterRead = performCutOnReadFile(
      showOutput,
      parsedValue
    );
    fs.fileReader(parsedValue.path, "utf8", performCutAfterRead);
  }
};

module.exports = performCut;
