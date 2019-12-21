const assert = require("chai").assert;
const { generateCutMessage } = require("../src/optionLib");

describe("generateCutMessage", () => {
  it("should give a string for the string in a list", () => {
    const actual = generateCutMessage(["abcde"]);
    const expected = "abcde\n";
    assert.deepStrictEqual(actual, expected);
  });
});
