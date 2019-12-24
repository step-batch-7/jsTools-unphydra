const assert = require("chai").assert;
const Events = require("events");
const performCut = require("../src/performCut");

describe("performCut", () => {
  it("should call callback for readfile", () => {
    const givenPath = "somePath";
    const givenEncoding = "utf8";
    const argv = ["-d", ",", "-f", "1", "somePath"];

    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(cutOutput.cutLine, "a\nb\nc");
      assert.isUndefined(cutOutput.errorLine);
    };
    const myfs = {
      fileReader: function(path, encoding, callback) {
        assert.deepStrictEqual(path, givenPath);
        assert.deepStrictEqual(encoding, givenEncoding);
        callback(null, "a\nb\nc");
      },
      fileExists: function(path) {
        assert.deepStrictEqual(path, givenPath);
        return true;
      }
    };
    performCut(myfs, argv, showOutput);
  });

  it("should call callback for standerInput", () => {
    const myEmitter = new Events();
    const argv = ["-d", ",", "-f", "1"];

    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(cutOutput.cutLine, "a");
      assert.isUndefined(cutOutput.errorLine);
    };
    myEmitter.resume = () => {};

    performCut("fs", argv, showOutput, myEmitter);
    myEmitter.emit("line", "a,b");
  });
});
