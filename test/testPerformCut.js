const assert = require('chai').assert;
const sinon = require('sinon');
const { performCut } = require('../src/performCut');

describe('sudoMain test', () => {
  afterEach(() => {
    sinon.restore;
  });
  describe('performCut', () => {
    it('should call callback for readFile with no new line at end', (done) => {
      const argv = ['-d', ',', '-f', '1', 'somePath'];
      const showOutput = sinon.fake(() => done());
      const fs = {
        readFile: sinon.fake.yields(null, 'a,b\nb\nc')
      };
      performCut({fs}, argv, showOutput);
      assert.ok(showOutput.calledWithExactly({cutLine: 'a\nb\nc'}));
    });

    it('should call callback for readFile with new line at end', (done) => {
      const argv = ['-d', ',', '-f', '1', 'somePath'];
      const showOutput = sinon.fake(() => done());
      const fs = {
        readFile: sinon.fake.yields(null, 'a,b\nb\nc\n')
      };
      performCut({fs}, argv, showOutput);
      assert.ok(showOutput.calledWithExactly({cutLine: 'a\nb\nc'}));
    });

    it('should call callback for standerInput', (done) => {
      const argv = ['-d', ',', '-f', '1'];
      const myEmitter = {};
      myEmitter.on = sinon.fake.yields('a,b');
      const showOutput = sinon.fake(() => done());
      myEmitter.resume = () => {};
      performCut({fs: {}, readLine: myEmitter}, argv, showOutput );
      assert.ok(showOutput.calledWithExactly({cutLine: 'a'}));
      sinon.assert.calledOnce(showOutput);
      sinon.assert.calledOnce(myEmitter.on);
    });

    it('should give no such file error if file is not present', (done) => {
      const argv = ['-d', ',', '-f', '1', 'somePath'];
      const showOutput = sinon.fake(() => done());
      const possibleError = { code: 'ENOENT' };
      const fs = {
        readFile: sinon.fake.yields(possibleError, null)
      };
      performCut({fs}, argv, showOutput);
      const expected = {
        errorLine: 'cut: somePath: No such file or directory',
        exitCode: 1};
      assert.ok(showOutput.calledWithExactly(expected));
      sinon.assert.calledOnce(showOutput);
    });

    it('should give reading error if a directory is given', (done) => {
      const argv = ['-d', ',', '-f', '1', 'somePathOfDir'];
      const showOutput = sinon.fake(() => done());
      const possibleError = { code: 'EISDIR' };
      const fs = {
        readFile: sinon.fake.yields(possibleError, null)
      };
      performCut({fs}, argv, showOutput);
      const expected = {
        errorLine: 'cut: Error reading somePathOfDir',
        exitCode: 74};
      assert.ok(showOutput.calledWithExactly(expected));
      sinon.assert.calledOnce(showOutput);
    });

    it('should permission denied if a unreadable file is given', (done) => {
      const argv = ['-d', ',', '-f', '1', 'unreadableFile'];
      const showOutput = sinon.fake(() => done());
      const possibleError = { code: 'EACCES' };
      const fs = {
        readFile: sinon.fake.yields(possibleError, null)
      };
      performCut({fs}, argv, showOutput);
      const expected = {
        errorLine: 'cut: unreadableFile: Permission denied',
        exitCode: 1};
      assert.ok(showOutput.calledWithExactly(expected));
      sinon.assert.calledOnce(showOutput);
    });

    it('should give usages if no option is given', (done) => {
      const argv = ['node', 'cut.js'];
      const showOutput = sinon.fake(() => done());
      performCut({}, argv, showOutput, {});
      const expected = {
        errorLine: 'usage: cut -b list [-n] [file ...]\n' +
        '       cut -c list [file ...]\n' + 
        '       cut -f list [-s] [-d delim] [file ...]',
        exitCode: 1};
      assert.ok(showOutput.calledWithExactly(expected));
      sinon.assert.calledOnce(showOutput);
    });
  });
});
