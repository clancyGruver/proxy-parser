const 
    rq = require('request-promise'),
    rc = require('./RedisQueue');
/**
 * Class for checkin proxy on ya.ru
 */
class CheckProxy{    
    /**
     * proxy - {ip: string, port: string} | sting 'ip:port'
     */
    constructor(proxy){
        this.proxy = typeof proxy === {} ? 'http://' + proxy.ip + ':' + proxy.port : proxy;
        this.options = {
            url: 'http://ya.ru/', //url for checking proxy
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
            },
            proxy:this.proxy, // set proxy for check
            resolveWithFullResponse: true //response with responseStatus
        };
    }

    insert_to_redis(){
        const redisClient = new rc(null, 'proxy'); // create redis client for inserting to redis in db: 'db0', key: 'proxy'
        redisClient.push(this.proxy); //add proxy to redis
        redisClient.close(); //close connection to redis
    }

    check(){
        rq(this.options)
            .then(this.callbackSuccess)
            .catch();
    }

    callbackSuccess(response) {
        if (response.statusCode == 200) {
            this.insert_to_redis(this.proxy);
        }
    }
}

module.exports = CheckProxy;