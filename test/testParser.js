const assert = require("chai").assert;
const { parser } = require("../src/parser");

describe("parser", () => {
  it("should filter the argument", () => {
    const args = ["node", "cut,js", "-d", ",", "-f", "2", "somePath"];
    const actual = parser(args);
    const expected = { delimiter: ",", fields: [2], path: "somePath" };
    assert.deepStrictEqual(actual, expected);
  });
});
