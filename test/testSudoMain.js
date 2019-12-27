const assert = require("chai").assert;
const Events = require("events");
const { performCut } = require("../src/performCut");

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
      readFile: function(path, encoding, callback) {
        assert.deepStrictEqual(path, givenPath);
        assert.deepStrictEqual(encoding, givenEncoding);
        callback(null, "a\nb\nc");
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

  it("should give no such file error if file is not present in the given path", () => {
    const givenPath = "somePath";
    const givenEncoding = "utf8";
    const argv = ["-d", ",", "-f", "1", "somePath"];

    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(
        cutOutput.errorLine,
        "cut: somePath: No such file or directory"
      );
      assert.isUndefined(cutOutput.cutLine);
    };
    const possibleError = { code: "ENOENT" };
    const myfs = {
      readFile: function(path, encoding, callback) {
        assert.deepStrictEqual(path, givenPath);
        assert.deepStrictEqual(encoding, givenEncoding);
        callback(possibleError, "a\nb\nc");
      }
    };
    performCut(myfs, argv, showOutput);
  });

  it("should give error reading error if a directory is given", () => {
    const givenPath = "somePathOfDir";
    const givenEncoding = "utf8";
    const argv = ["-d", ",", "-f", "1", "somePathOfDir"];

    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(
        cutOutput.errorLine,
        "cut: Error reading somePathOfDir"
      );
      assert.isUndefined(cutOutput.cutLine);
    };
    const possibleError = { code: "EISDIR" };
    const myfs = {
      readFile: function(path, encoding, callback) {
        assert.deepStrictEqual(path, givenPath);
        assert.deepStrictEqual(encoding, givenEncoding);
        callback(possibleError, "a\nb\nc");
      }
    };
    performCut(myfs, argv, showOutput);
  });

  it("should permission denied if a unreadable file is given is given", () => {
    const givenPath = "unreadableFile";
    const givenEncoding = "utf8";
    const argv = ["-d", ",", "-f", "1", "unreadableFile"];

    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(
        cutOutput.errorLine,
        "cut: unreadableFile: Permission denied"
      );
      assert.isUndefined(cutOutput.cutLine);
    };
    const possibleError = { code: "EACCES" };
    const myfs = {
      readFile: function(path, encoding, callback) {
        assert.deepStrictEqual(path, givenPath);
        assert.deepStrictEqual(encoding, givenEncoding);
        callback(possibleError, "a\nb\nc");
      }
    };
    performCut(myfs, argv, showOutput);
  });
});
