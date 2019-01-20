const 
    rc = require('./RedisQueue'),
    proxyRedisQueue = new rc(null, 'proxy'),
    D = require('./downloader'),
    Downloader = new D(),
    SOC = require('./spys_one_callback'),
    pc = require('./proxyCheck');

function check_proxies(){
    proxyRedisQueue.showQueue.map((proxy)=>{
        new pc(proxy);
    });
}

function proxy_collect() {
    console.log('start collecting proxies');
    const time = 2*60*60*1000; // 2 hours
    if(proxyRedisQueue.len > 1000){
        Downloader.urls.map((url)=>{
            new SOC(Downloader.download_page(url));
        });
    }
    setTimeout(proxy_collect, time);
}

function check_proxy_collection() {
    console.log('start check proxies');
    const time = 30*60*1000; // half of hour
    check_proxies();
    setTimeout(check_proxy_collection, time);
} 
proxy_collect();   
check_proxy_collection();