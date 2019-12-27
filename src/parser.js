const parser = function(args) {
  const indexOfD = args.indexOf("-d");
  const delimiter = args[indexOfD + 1];
  const indexOfF = args.indexOf("-f");
  const fields = [+args[indexOfF + 1]];
  const maxIndex = Math.max(indexOfD, indexOfF);
  const path = args[maxIndex + 2];
  return { delimiter, fields, path };
};

module.exports = { parser };
