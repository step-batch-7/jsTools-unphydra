const { generateCutMessage, getCutLines } = require('./optionLib');
const { parser } = require('./parser');

const performCutForReadFile = function(showOutput, parsedValue) {
  return function(error, contents) {
    if (error) {
      callOnError(error, showOutput, parsedValue.path);
      return;
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
  showOutput({ errorLine, exitCode });
};

const performCutForStdin = function(parsedValue, showOutput, readLine) {
  readLine.resume();
  readLine.on('line', line => {
    const cutLine = performCutOperation(line, parsedValue);
    showOutput({ cutLine });
  });
};

const performCutOperation = function(line, parsedValue) {
  const listOfLines = line.split('\n');
  const listOfCutLines = getCutLines(listOfLines, parsedValue);
  return generateCutMessage(listOfCutLines);
};

const performCut = function(IOInterface, args, showOutput) {
  const parsedValue = parser(args);
  if (parsedValue.errorLine) {
    const { errorLine, exitCode } = parsedValue;
    return showOutput({ errorLine, exitCode });
  }
  if (!parsedValue.path) {
    performCutForStdin(parsedValue, showOutput, IOInterface.readLine);
  } else {
    const performCutAfterRead = performCutForReadFile(
      showOutput,
      parsedValue
    );
    IOInterface.fs.readFile(parsedValue.path, 'utf8', performCutAfterRead);
  }
};

module.exports = {
  performCut,
  performCutForReadFile,
  performCutForStdin,
  performCutOperation
};
