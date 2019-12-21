const assert = require("chai").assert;
const { generateCutMessage } = require("../src/optionLib");

describe("generateCutMessage", () => {
  it("should give a string for the string in a list", () => {
    const actual = generateCutMessage(["abcde"]);
    const expected = "abcde\n";
    assert.deepStrictEqual(actual, expected);
  });

  it("should give nothing if nothing in the list", () => {
    const actual = generateCutMessage([]);
    const expected = "";
    assert.deepStrictEqual(actual, expected);
  });

  it("should give string for multiple string of list", () => {
    const actual = generateCutMessage(["abcde", "fghij", "klmno"]);
    const expected = "abcde\nfghij\nklmno\n";
    assert.deepStrictEqual(actual, expected);
  });
});
