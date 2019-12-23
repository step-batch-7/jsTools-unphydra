const generateCutMessage = function(listOfOutput) {
  return listOfOutput.join("\n");
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

const parser = function(args) {
  const indexOfD = args.indexOf("-d");
  const delim = args[indexOfD + 1];
  const indexOfF = args.indexOf("-f");
  const fields = [+args[indexOfF + 1]];
  const maxIndex = Math.max(indexOfD, indexOfF);
  const path = args[maxIndex + 2];
  return { delim, fields, path };
};

module.exports = {
  generateCutMessage,
  getCutLines,
  parser
};
