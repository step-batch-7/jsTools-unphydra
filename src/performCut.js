const { generateCutMessage, getCutLines, parser } = require("./optionLib");

const performCutForReadFile = function(showOutput, parsedValue, path) {
  return function(error, contents) {
    if (error) {
      callOnError(error, showOutput, path);
    }
    const cutLine = performCutOperation(contents, parsedValue);
    showOutput({ cutLine });
  };
};

const callOnError = function(error, showOutput, path) {
  const errorList = {
    ENOENT: {
      message: `cut: ${path}: No such file or directory`,
      code: 1
    },
    EISDIR: { message: `cut: Error reading ${path}`, code: 74 },
    EACCES: { message: `cut: ${path}: Permission denied`, code: 1 }
  };
  const errorLine = errorList[error.code].message;
  const exitCode = errorList[error.code].code;
  showOutput({ errorLine });
  process.exit(exitCode);
};

const performCutForStdin = function(parsedValue, showOutput, readLine) {
  readLine.resume();
  readLine.on("line", line => {
    const cutLine = performCutOperation(line, parsedValue);
    showOutput({ cutLine });
  });
};

const performCutOperation = function(line, parsedValue) {
  const listOfLines = line.split("\n");
  const listOfCutLines = getCutLines(listOfLines, parsedValue);
  return generateCutMessage(listOfCutLines);
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

module.exports = {
  performCut,
  performCutForReadFile,
  performCutForStdin,
  performCutOperation
};
