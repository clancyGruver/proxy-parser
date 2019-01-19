const
    rp = require("request-promise");

class Downloader{
    constructor(urls) {
        this.urls = urls || [
            "http://spys.one/proxies/",
            "http://spys.one/proxies/1/",
            "http://spys.one/proxies/2/",
            "http://spys.one/proxies/3/",
        ];

        this.options = {
            uri: 'http://spys.one/proxies/',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0'
            }
        }
    }

    download_page (url) {
        const options = this.options;
        options.uri = url;
        return rp(options);
    }
}

module.exports = Downloader;