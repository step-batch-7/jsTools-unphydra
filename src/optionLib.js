const getMessage = function(result, line) {
  return (result = `${result}${line}\n`);
};
const generateCutMessage = function(listOfOutput) {
  let result = "";
  return listOfOutput.reduce(getMessage, result);
};

const getCutLines = function(list, instruction) {
  const result = [];
  list.forEach(line => {
    const fieldsOfLine = line.split(instruction.delim);
    if (fieldsOfLine.length == 1) {
      result.push(fieldsOfLine[0]);
    } else {
      result.push(fieldsOfLine[instruction.fields[0] - 1]);
    }
  });
  return result;
};

module.exports = { generateCutMessage, getCutLines };
