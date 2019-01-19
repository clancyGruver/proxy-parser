const D = require('../downloader');
const Downloader = new D();

describe('Downloader module', () => {
  describe('"download_page"', () => {
    it('should export a function', () => {
      expect(Downloader.download_page).to.be.a('function')
    });
    it('should return a Promise', () => {
      const downloaderDownloadPageResult = Downloader.download_page('http://spys.one/proxies/')
      expect(downloaderDownloadPageResult.then).to.be.a('Function')
      expect(downloaderDownloadPageResult.catch).to.be.a('Function')
    })
  })
})
