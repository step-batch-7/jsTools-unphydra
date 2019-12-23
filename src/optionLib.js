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

module.exports = { generateCutMessage, getCutLines };
