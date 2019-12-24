const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutForReadFile = function(showOutput, parsedValue) {
  return function(error, data) {
    const listOfLines = data.split("\n");
    const listOfCutLines = getCutLines(listOfLines, parsedValue);
    const cutLine = generateCutMessage(listOfCutLines);
    showOutput({ cutLine });
  };
};

const performCutForStdin = function(parsedValue, showOutput, rl) {
  rl.resume();
  rl.on("line", line => {
    const listOfCutLines = getCutLines([line], parsedValue);
    const cutLine = generateCutMessage(listOfCutLines);
    showOutput({ cutLine });
  });
};

const performCut = function(fs, args, showOutput, rl) {
  const parsedValue = parser(args);
  if (!parsedValue.path) {
    performCutForStdin(parsedValue, showOutput, rl);
  } else {
    if (!fs.fileExists(parsedValue.path)) {
      const errorLine = `cut: ${parsedValue.path}: No such file or directory`;
      showOutput({ errorLine });
      return;
    }
    const performCutAfterRead = performCutForReadFile(
      showOutput,
      parsedValue
    );
    fs.fileReader(parsedValue.path, "utf8", performCutAfterRead);
  }
};

module.exports = performCut;
