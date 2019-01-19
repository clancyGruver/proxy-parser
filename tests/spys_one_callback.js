const S = require('../spys_one_callback');
const expect = require('chai').expect

describe('spys.one callback module', () => {
  const SpysOne = new S(Downloader.download_page('http://spys.one/proxies/'));
  console.log(SpysOne);
  describe('"getCipherScript"', () => {
    it('should export a function', () => {
      expect(SpysOne.getCipherScript).to.be.a('function')
    });
    it('should set SpysOne.cipher a string', () => {
      const spysOneCallbackGetCipherScriptResult = SpysOne.getCipherScript();
      expect(SpysOne.cipher).to.be.a('String')
    })
  })
})