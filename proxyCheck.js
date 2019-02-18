const 
    rq = require('request'),
    rc = require('./RedisQueue');
/**
 * Class for checkin proxy on ya.ru
 */
class CheckProxy{    
    /**
     * proxy - {ip: string, port: string} | sting 'ip:port'
     */
    constructor(proxy, score){
        this.score = score || 1;
        this.proxy = typeof proxy === typeof {} ? 'http://' + proxy.ip + ':' + proxy.port : proxy;
        this.options = {
            url: 'http://ya.ru/', //url for checking proxy
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
            },
            proxy:this.proxy, // set proxy for check
            resolveWithFullResponse: true //response with responseStatus
        };
    }

    check(){
        rq(this.options, (error, response)=>{
            if (!error && response.statusCode == 200) {
                const redisClient = new rc(null, 'proxy'); // create redis client for inserting to redis in db: 'db0', key: 'proxy'
                redisClient.push([this.score, this.proxy]); //add proxy to redis
                redisClient.close(); //close connection to redis
                console.log('Good proxy: ' + this.proxy);
            } else {
                console.error('Error occured ' + error);
            }

        });
    }
}

module.exports = CheckProxy;