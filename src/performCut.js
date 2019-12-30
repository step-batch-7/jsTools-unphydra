const { generateCutMessage, getCutLines } = require('./optionLib');
const { parser } = require('./parser');

const performCutForReadFile = function(onCompletion, parsedValue) {
  return function(error, contents) {
    if (error) {
      callOnError(error, onCompletion, parsedValue.path);
      return;
    }
    const cutLine = performCutOperation(contents, parsedValue);
    onCompletion({ cutLine });
  };
};

const callOnError = function(error, onCompletion, path) {
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
  onCompletion({ errorLine, exitCode });
};

const performCutForStdin = function(parsedValue, onCompletion, readLine) {
  readLine.resume();
  readLine.on('line', line => {
    const cutLine = performCutOperation(line, parsedValue);
    onCompletion({ cutLine });
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
    return;
  }
  const performCutAfterRead = performCutForReadFile(
    showOutput,
    parsedValue
  );
  IOInterface.fs.readFile(parsedValue.path, 'utf8', performCutAfterRead);
};

module.exports = {
  performCut
};
