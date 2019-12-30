const errorHandler = function (type) {
  const errorList = {
    showUsages:
      'usage: cut -b list [-n] [file ...]\n'
      + '       cut -c list [file ...]\n'
      + '       cut -f list [-s] [-d delim] [file ...]'
  };
  return errorList[type];
};

const getDelimiter = function (args) {
  const indexOfDelim = args.indexOf('-d');
  const delimValueIndexInc = 1;
  return args[indexOfDelim + delimValueIndexInc];
};

const getFields = function (args) {
  const indexOfField = args.indexOf('-f');
  const fieldsValueIndexInc = 1;
  return [+args[indexOfField + fieldsValueIndexInc]];
};

const parser = function (args) {
  let [delimiter, errorLine, exitCode] = ['\t', ''];
  const minLength = 2, codeNum = 1;
  if (args.length === minLength) {
    errorLine = errorHandler('showUsages');
    exitCode = codeNum;
  }
  delimiter = getDelimiter(args);
  const fields = getFields(args);
  const pathIndexDec = 2;
  const path = args[ args.indexOf('-f') + pathIndexDec];
  return { delimiter, fields, path, errorLine, exitCode };
};

module.exports = { parser };
