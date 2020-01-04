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
 
  it('should give illegal option if invalid option is given', () => {
    const args = ['-a'];
    const actual = cutParser(args).errorLine;
    const expected = 'cut: illegal option -- a\n' +
      'usage: cut -b list [-n] [file ...]\n' +
      '       cut -c list [file ...]\n' +
      '       cut -f list [-s] [-d delim] [file ...]';
    assert.deepStrictEqual(actual, expected);
  });

  it('should give option require an argument if no value is given', () => {
    const args = ['-d'];
    const actual = cutParser(args).errorLine;
    const expected = 'cut: option requires an argument -- d\n' +
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
