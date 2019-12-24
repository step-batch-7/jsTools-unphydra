const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutOnReadFile = function(showOutput, parsedValue) {
  return function(error, data) {
    const listOfLines = data.split("\n");
    const listOfCutLines = getCutLines(listOfLines, parsedValue);
    const cutLine = generateCutMessage(listOfCutLines);
    showOutput({ cutLine });
  };
};

const performCutOnStdin = function(inst, showOutput, rl) {
  rl.resume();
  rl.on("line", line => {
    const listOfLines = [line];
    const listOfCutLines = getCutLines(listOfLines, inst);
    const cutLine = generateCutMessage(listOfCutLines);
    showOutput({ cutLine });
  });
};

const performCut = function(fs, args, showOutput, rl) {
  rl.pause();
  const parsedValue = parser(args);
  if (!parsedValue.path) {
    performCutOnStdin(parsedValue, showOutput, rl);
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
