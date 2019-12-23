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
    const fields = line.split(instruction.delim);
    if (fields.length == 1) {
      result.push(fields[0]);
    }
  });
  return result;
};

module.exports = { generateCutMessage, getCutLines };
