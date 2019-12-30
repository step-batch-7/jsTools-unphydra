const assert = require('chai').assert;
const { generateCutMessage, getCutLines } = require('../src/optionLib');

describe('cut.js', () => {
  describe('generateCutMessage', () => {
    it('should give a string for the string in a list', () => {
      const actual = generateCutMessage(['abcde']);
      const expected = 'abcde';
      assert.deepStrictEqual(actual, expected);
    });

    it('should give nothing if nothing in the list', () => {
      const actual = generateCutMessage([]);
      const expected = '';
      assert.deepStrictEqual(actual, expected);
    });

    it('should give string for multiple string of list', () => {
      const actual = generateCutMessage(['abcde', 'fghij', 'klmno']);
      const expected = 'abcde\nfghij\nklmno';
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('getCutLines', () => {
    it('should give cut lines for line which does not has tab', () => {
      const expectedField = 2;
      const instruction = { delimiter: '\t', fields: [expectedField] };
      const actual = getCutLines(['a,b,c,d', 'a,b,c,d'], instruction);
      const expected = ['a,b,c,d', 'a,b,c,d'];
      assert.deepStrictEqual(actual, expected);
    });

    it('should give cut lines for line which has tab', () => {
      const expectedField = 2;
      const instruction = { delimiter: '\t', fields: [expectedField] };
      const actual = getCutLines(['a,b\tc,d', 'a,b,c,d'], instruction);
      const expected = ['c,d', 'a,b,c,d'];
      assert.deepStrictEqual(actual, expected);
    });

    it('should give empty for a field where no char in that field', () => {
      const expectedField = 5;
      const instruction = { delimiter: ',', fields: [expectedField] };
      const actual = getCutLines(['a,b,c,d', 'a,b,c,d'], instruction);
      const expected = ['', ''];
      assert.deepStrictEqual(actual, expected);
    });
  });
});
