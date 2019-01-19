const R = require('../RedisQueue');
const RedisQueue = new R(null, 'test');

RedisQueue.push('10.21.18.42:123');
RedisQueue.push(123);
RedisQueue.push({'foo':'bar'});
RedisQueue.push(['10.21.18.42:123','10.21.18.42:124','10.21.18.42:125','10.21.18.42:126','10.21.18.42:127']);
RedisQueue.len.then(val=>console.log(val));
RedisQueue.showQueue.then(v=>console.log(v));
RedisQueue.pop.then(val=>console.log(val));
RedisQueue.close();
