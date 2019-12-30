const assert = require('chai').assert;
const Events = require('events');
const {
  performCutForReadFile,
  performCutForStdin,
  performCutOperation
} = require('../src/performCut');

describe('performCutForStdin', () => {
  it('should read line from line event', () => {
    let count = 0;
    const expectedField = 1, expectedCount = 3;
    const myEmitter = new Events();
    myEmitter.resume = () => {};
    const parsedValue = { delimiter: ',',
      path: undefined,
      fields: [expectedField] };
    const showOutput = function(cutOutput) {
      assert.oneOf(cutOutput.cutLine, ['a', 'a-b']);
      assert.isUndefined(cutOutput.errorLine);
      count++;
    };
    performCutForStdin(parsedValue, showOutput, myEmitter);
    myEmitter.emit('line', 'a,b');
    myEmitter.emit('line', 'a-b');
    assert.deepStrictEqual(count, expectedCount);
  });
});

describe('performCutForReadFile', () => {
  it('should give whole line if line is not splitted by delimiter', () => {
    const expectedField = 1;
    const parsedValue = { delimiter: ',',
      path: 'somePath',
      fields: [expectedField] };
    const showOutput = function(cutOutput) {
      assert.deepStrictEqual(cutOutput.cutLine, 'a-b');
      assert.isUndefined(cutOutput.errorLine);
    };
    const line = 'a-b';
    performCutForReadFile(showOutput, parsedValue)(null, line);
  });
});

describe('performCutOperation', () => {
  it('should give 1st filed if delim can divided the string into two', () => {
    const expectedField = 2;
    const line = 'a,b';
    const parsedValue = {
      delimiter: ',',
      fields: [expectedField]
    };
    const actual = performCutOperation(line, parsedValue);
    const expected = 'b';
    assert.deepStrictEqual(actual, expected);
  });
});
