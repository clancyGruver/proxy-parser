/**
 * Queue Redis based on sorted set
 */
const
    Promise = require('bluebird'),
    redis = require('redis');

Promise.promisifyAll(redis);

class RedisQueue{
    constructor(clentOptions, queueName){
        this.client = clentOptions ? redis.createClient(clentOptions) : redis.createClient();
        this.queueName = queueName;

        this.client.on('error', function(err){
            console.log('Something went wrong ', err);
        });

        this.client.on('connect', function () {
            console.log('Redis connected');
        });

        this.lastValue = null;
    }

    get len(){
        return this.client.zcardAsync(this.queueName);
    }

    push(value){
        if(typeof value == [] && value.length > 0){
            this.client.zaddAsync(this.queueName,...value);
        }
        else{
            this.client.zaddAsync(this.queueName, value);
        }
    }

    get pop(){
        return this.client.zpopminAsync(this.queueName);
    }

    get showQueue(){
        return this.client.zrangeAsync(this.queueName, 0, -1);
    }

    close(){
        this.client.quit();
    }
}

module.exports = RedisQueue;