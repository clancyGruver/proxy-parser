const 
    rp = require('request-promise'),
    cheerio = require('cheerio'),
    pages = [
        'http://spys.one/proxies/',
        'http://spys.one/proxies/1/',
        'http://spys.one/proxies/2/',
        'http://spys.one/proxies/3/',
    ],
    options = {
        uri: 'http://spys.one/proxies/',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
        },
        transform: function (body) {
            return cheerio.load(body);
        }
    },
    redis = require('redis'),
    client = redis.createClient();

client.on('error', function (err) {
    console.log('Error ' + err);
});

function get_proxies(){
    pages.forEach((v)=>{
        options.url = v;
        rp(options)
            .then(($)=>{
                const
                    scripts = $('body>script'),
                    script_codes = {},
                    proxy_row = $('table>tbody>tr>td>table>tbody>tr'),
                    script = $(scripts['1']).html();
    
                get_script_codes(script).map((v)=>{
                    script_codes[v.name] = v.value;
                });
                
                proxy_row.map(function(){
                    const 
                        proxy = get_proxy_td($(this).find('td'));
                    if(proxy === false)
                        return;
                    const 
                        clear_proxy = clean_proxy(script_codes, proxy);
                    
                    check_proxy(clear_proxy);
                });
            })
            .catch(function (err) {
                console.log('Произошла ошибка: ' + err);
            });
    });
}

    
function get_script_codes(script){
    const scripts = script.split(';').slice(0,-1),
        codes = [],
        re = /(\d\^.+)/i;
    scripts.map((v)=>{
        const code = v.split('='),
            re_res = code[1].match(re);
        if(re_res !== null)
            codes.push({name:code[0], value:code[1].slice(0,1)});
    });
    return codes;
}

function get_proxy_td(val){
    const 
        $ = cheerio.load(val);
    let 
        //protocol = $($(val['1'])),
        proxy = $($(val['0']));
    if(proxy.attr('colspan') !== '1')
        return false;    
    proxy = $($(proxy).find('font.spy14')['0']);
    if(proxy.contents().length === 0)
        return false;
    /*protocol = $(protocol).find('font.spy14');
    protocol = protocol ? 'https://' : 'http://';*/
    return proxy;
}

function clean_proxy(decriptor, str){
    const 
        $ = cheerio.load(str);
    str = $(str);

    const
        ip = str.text(),
        script_cripted = str.children('script').html().split('+').slice(1);
    
    let 
        port = '';

    script_cripted.map((v)=>{
        port += decriptor[v.slice(1,-1).split('^')[0]];
    });

    return {ip:ip, port:port};
}

function check_proxy(proxy){    
    const 
        full_proxy = 'http://' + proxy.ip + ':' + proxy.port,
        options = {
            url: 'http://' + 'ya.ru/',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
            },
            proxy:full_proxy
        },
        r = require('request');
    
    function insert_to_redis(full_proxy){
        console.log('Inserted to redis');
        client.rpush('proxy', full_proxy);
    }

    function callback(error, response) {
        if (!error && response.statusCode == 200) {
            console.log(full_proxy, 'good');
            insert_to_redis(full_proxy);
        }
        else {
            console.log(full_proxy);
            console.log('Check_proxy error: ', error);
        }
    }
    r(options, callback);
}

function check_proxies(){
    const count = client.llen('proxy');
    for(let i = 0; i < count; i++){
        client.lpop('proxy', function(error, str){
            let res = str.split(':');
            check_proxy({ip:res[0],port:res[1]});
        });        
    }    
}

function proxy_collect() {
    console.log('start collect proxies');
    const time = 2*60*60*1000; // 2 hours
    setTimeout(()=>{
        if(client.llen('proxy') > 1000)
            get_proxies();
        proxy_collect();
    }, time);
}

function check_proxy_collection() {
    console.log('start check proxies');
    const time = 30*60*1000; // half of hour
    check_proxies();
    setTimeout(check_proxy_collection, time);
} 
proxy_collect();   
check_proxy_collection();