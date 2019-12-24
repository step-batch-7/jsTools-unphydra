const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutForReadFile = function(showOutput, parsedValue, path) {
  const errorList = {
    ENOENT: `cut: ${path}: No such file or directory`,
    EISDIR: `cut: Error reading ${path}`,
    EACCES: `cut: ${path}: Permission denied`
  };

  return function(error, data) {
    if (error) {
      const errorLine = errorList[error.code];
      showOutput({ errorLine });
      return;
    }
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
    const performCutAfterRead = performCutForReadFile(
      showOutput,
      parsedValue,
      parsedValue.path
    );
    fs.fileReader(parsedValue.path, "utf8", performCutAfterRead);
  }
};

module.exports = { performCut, performCutForReadFile, performCutForStdin };
