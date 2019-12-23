const getMessage = function(result, line) {
  return (result = `${result}${line}\n`);
};
const generateCutMessage = function(listOfOutput) {
  let result = "";
  return listOfOutput.reduce(getMessage, result);
};

const getFields = function(line) {
  const fieldsOfLine = line.split(this.delim);
  if (fieldsOfLine.length == 1) {
    return fieldsOfLine[0];
  }
  const reqField = this.fields[0] - 1;
  if (!fieldsOfLine[reqField]) {
    fieldsOfLine[reqField] = "";
  }
  return fieldsOfLine[reqField];
};

const getCutLines = function(list, instruction) {
  const result = list.map(getFields.bind(instruction));
  return result;
};

const getListOfFileContents = function(fs, path, encoder) {
  return fs
    .fileReader(path, encoder)
    .split("\n")
    .slice(0, -1);
};

const parser = function(args) {
  const indexOfD = args.indexOf("-d");
  const delim = args[indexOfD + 1];
  const indexOfF = args.indexOf("-f");
  const fields = [+args[indexOfF + 1]];
  const path = args[args.length - 1];
  return { delim, fields, path };
};

module.exports = {
  generateCutMessage,
  getCutLines,
  getListOfFileContents,
  parser
};
