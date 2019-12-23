const getMessage = function(result, line) {
  return (result = `${result}${line}\n`);
};
const generateCutMessage = function(listOfOutput) {
  let result = "";
  return listOfOutput.reduce(getMessage, result);
};

const getCutLines = function(list, instruction) {
  const result = list.map(line => {
    const fieldsOfLine = line.split(instruction.delim);
    if (fieldsOfLine.length == 1) {
      return fieldsOfLine[0];
    }
    const reqField = instruction.fields[0] - 1;
    if (!fieldsOfLine[reqField]) {
      fieldsOfLine[reqField] = "";
    }
    return fieldsOfLine[reqField];
  });
  return result;
};

module.exports = { generateCutMessage, getCutLines };
