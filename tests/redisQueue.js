const R = require('../RedisQueue');
const RedisQueue = new R(null, 'test');

RedisQueue.enqueu('10.21.18.42:123');
RedisQueue.enqueu('10.21.18.42:124');
RedisQueue.enqueu('10.21.18.42:125');
RedisQueue.enqueu('10.21.18.42:126');
RedisQueue.enqueu('10.21.18.42:127');
RedisQueue.enqueu('10.21.18.42:128');
console.log(RedisQueue.count());
//console.log(RedisQueue.showQueue());
//console.log(RedisQueue.dequeue());
RedisQueue.close()
