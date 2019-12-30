const assert = require('chai').assert;
const { parser } = require('../src/parser');

describe('parser', () => {
  it('should give usages if no option is given', () => {
    const args = ['node', 'cut,js'];
    const actual = parser(args).errorLine;
    const expected =
      'usage: cut -b list [-n] [file ...]\n' +
      '       cut -c list [file ...]\n' +
      '       cut -f list [-s] [-d delim] [file ...]';
    assert.deepStrictEqual(actual, expected);
  });

  it('should filter the argument', () => {
    const args = ['node', 'cut,js', '-d', ',', '-f', '2', 'somePath'];
    const expectedField = 2;
    const actual = parser(args);
    const expected = {
      delimiter: ',',
      fields: [expectedField],
      path: 'somePath',
      errorLine: ''
    };
    assert.deepStrictEqual(actual, expected);
  });
});
