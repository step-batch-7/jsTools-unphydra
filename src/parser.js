const errorHandler = function(type) {
  errorList = {
    showUsages:
      "usage: cut -b list [-n] [file ...]\n       cut -c list [file ...]\n       cut -f list [-s] [-d delim] [file ...]"
  };
  return errorList[type];
};

const parser = function(args) {
  let delimiter = "\t";
  let errorLine = "";
  let exitCode;
  if (args.length == 2) {
    errorLine = errorHandler("showUsages");
    exitCode = 1;
  }
  const indexOfD = args.indexOf("-d");
  delimiter = args[indexOfD + 1];
  const indexOfF = args.indexOf("-f");
  const fields = [+args[indexOfF + 1]];
  const maxIndex = Math.max(indexOfD, indexOfF);
  const path = args[maxIndex + 2];
  return { delimiter, fields, path, errorLine };
};

module.exports = { parser };
