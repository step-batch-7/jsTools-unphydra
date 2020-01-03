const assert = require('chai').assert;
const cutParser = require('../src/parser');

describe('parser', () => {
  it('should give usages if no option is given', () => {
    const args = [];
    const actual = cutParser(args).errorLine;
    const expected =
      'usage: cut -b list [-n] [file ...]\n' +
      '       cut -c list [file ...]\n' +
      '       cut -f list [-s] [-d delim] [file ...]';
    assert.deepStrictEqual(actual, expected);
  });

  it('should filter the argument', () => {
    const args = ['-d', ',', '-f', '2', 'somePath'];
    const actual = cutParser(args);
    const expected = {
      delimiter: ',',
      fields: '2',
      files: ['somePath']
    };
    assert.deepStrictEqual(actual, expected);
  });
});
