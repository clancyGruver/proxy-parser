const
    redis = require('redis');

class RedisQueue{
    constructor(client, key){
        this.client = client || redis.createClient(6379,'10.97.114.250');
        this.key = key;

        this.client.on('error', function(err){
            console.log('Something went wrong ', err)
        });

        this.client.on("connect", function () {
            console.log('Redis connected')
        });
    }

    enqueu(value){
        this.client.sadd(this.key, value);
    }

    dequeue(){
        let res;
        return this.client.spop(this.key, (err,val)=>res = err || val);
        return res;
    }

    showQueue(){
        return this.client.sinter(this.client,(err,res)=>{console.log(err, res)});
    }

    count(){
        this.client.scard(this.key, function (err,val) {
            this._count = err ? null : val;
        });
        return this._count;
    }

    close(){
        this.client.quit();
    }
}

module.exports = RedisQueue;