const generateCutMessage = function (listOfOutput) {
  return listOfOutput.join('\n');
};

const getFields = function (line) {
  const fieldsOfLine = line.split(this.delimiter);
  const firstFieldIndex = 0;
  const reqFieldIndex = 1;
  if (fieldsOfLine.length === reqFieldIndex) {
    return fieldsOfLine[firstFieldIndex];
  }
  const reqField = this.fields[firstFieldIndex] - reqFieldIndex;
  if (!fieldsOfLine[reqField]) {
    fieldsOfLine[reqField] = '';
  }
  return fieldsOfLine[reqField];
};

const getCutLines = function (list, instruction) {
  const result = list.map(getFields.bind(instruction));
  return result;
};

module.exports = {
  generateCutMessage,
  getCutLines
};
