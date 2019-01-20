const
    cheerio = require('cheerio'),
    proxyCheck = require('./proxyCheck');

class SpysOne{
    constructor(htmlString){
        htmlString
            .then(resp=>{
                const
                    $ = cheerio.load(resp),
                    scripts = $('body>script'),
                    script_codes = {},
                    proxy_row = $('table>tbody>tr>td>table>tbody>tr'),
                    script = $(scripts['1']).html();
                console.log(script);
    
                get_script_codes(script).map((v)=>{
                    script_codes[v.name] = v.value;
                });
                
                proxy_row.map(function(){
                    const 
                        proxy = get_proxy_td($(this).find('td'));
                    if(proxy === false)
                        return;
                    const 
                        clear_proxy = clean_proxy(script_codes, proxy),
                        cp = new proxyCheck(clear_proxy);
                    cp.check();
                });
            })
            .catch(err=>console.log('Error occured ' + err ));
    }

    check_proxy(){
        
    }
    
    getCipherScript(){
        scripts =this.$('body>script'),
        script = this.$(scripts['1']).html();
        this.cipher = script;
    }
    
    get_script_codes(script){
        const scripts = script.split(';').slice(0,-1),
            codes = [],
            re = /(\d\^.+)/i;
        scripts.map((v,i)=>{
            const code = v.split('='),
                re_res = code[1].match(re);
            if(re_res !== null)
                codes.push({name:code[0], value:code[1].slice(0,1)});
        });
        return codes;
    }

    get_proxy_td(val){
        const 
            $ = cheerio.load(val);
        let 
            proxy = $($(val['0']));
        if(proxy.attr('colspan') !== '1')
            return false;    
        proxy = $($(proxy).find('font.spy14')['0']);
        if(proxy.contents().length === 0)
            return false;
        return proxy;
    }

    clean_proxy(decriptor, str){
        const 
            $ = cheerio.load(str);
        str = $(str);

        const
            ip = str.text();
            script_cripted = str.children('script').html().split('+').slice(1);
        
        let 
            port = '';

        script_cripted.map((v)=>{
            port += decriptor[v.slice(1,-1).split('^')[0]];
        });

        return {ip:ip, port:port};
    }

}

module.exports = SpysOne;