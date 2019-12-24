const assert = require("chai").assert;
const Events = require("events");
const {
  performCutForReadFile,
  performCutForStdin
} = require("../src/performCut");

describe("performCutForStdin", () => {
  it("should read line from line event", () => {
    let count = 0;
    const myEmitter = new Events();
    myEmitter.resume = () => {};
    const parsedValue = { delim: ",", path: undefined, fields: [1] };
    const showOutput = function(cutOutput) {
      assert.oneOf(cutOutput.cutLine, ["a", "a-b", ""]);
      assert.isUndefined(cutOutput.errorLine);
      count++;
    };
    performCutForStdin(parsedValue, showOutput, myEmitter);
    myEmitter.emit("line", "a,b");
    myEmitter.emit("line", "a-b");
    myEmitter.emit("line", "");
    assert.deepStrictEqual(count, 3);
  });
});

describe("performCutForReadFile", () => {
  it("should give whole line if line is not splitted by deliminator", () => {
    const parsedValue = { delim: ",", path: "somePath", fields: [1] };
    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(cutOutput.cutLine, "a-b");
      assert.isUndefined(cutOutput.errorLine);
    };
    const line = "a-b";
    performCutForReadFile(showOutput, parsedValue)(null, line);
  });
});
