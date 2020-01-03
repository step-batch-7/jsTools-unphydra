/* eslint-disable no-magic-numbers */
const { generateCutMessage, getCutLines } = require('./optionLib');
const cutParser = require('./parser');

const performCutForReadFile = function(path, onCompletion) {
  return function(error, contents) {
    if (error) {
      const fileTypeError = callOnError(error, path);
      return onCompletion({error: fileTypeError});
    }
    onCompletion({ line: contents });
  };
};

const callOnError = function(error, path) {
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
  return {errorLine, exitCode};
};

const performCutForStdin = function(readLine, onCompletion) {
  readLine.resume();
  readLine.on('line', line => {
    onCompletion({line});
  });
};

const callOnFinish = function(parsedValue, showOutput){
  return function({error, line}) {
    if(error){
      return showOutput(error);
    }
    const cutLine = performCutOperation(line, parsedValue);
    showOutput({cutLine});
  };
};

const performCutOperation = function(line, parsedValue) {

  const listOfLines = line.split('\n');
  listOfLines.slice().pop() ? listOfLines : listOfLines.pop();
  const listOfCutLines = getCutLines(listOfLines, parsedValue);
  return generateCutMessage(listOfCutLines);
};

const performCut = function(IOInterface, args, showOutput) {
  const parsedValue = cutParser(args);
  if (parsedValue.errorLine) {
    const { errorLine, exitCode } = parsedValue;
    return showOutput({ errorLine, exitCode });
  }
  const onReadComplete = callOnFinish(parsedValue, showOutput);
  
  if (!parsedValue.files[0]) {
    performCutForStdin(IOInterface.readLine, onReadComplete);
    return;
  }
  const performCutAfterRead = performCutForReadFile(
    parsedValue.files[0], onReadComplete
  );
  IOInterface.fs.readFile(parsedValue.files[0], 'utf8', performCutAfterRead);
};

module.exports = {
  performCut
};
