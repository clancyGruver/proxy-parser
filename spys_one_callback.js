const
    cheerio = require('cheerio'),
    proxyCheck = require('./proxyCheck');
/**
 * htmlString - promise of html
 */
class SpysOne{
    constructor(htmlString){
        this.script_codes = {};
        this.proxies = [];
        htmlString
            .then(resp=>{
                const
                    $ = cheerio.load(resp),
                    scripts = $('body>script'),                    
                    proxy_rows = $('table>tbody>tr>td>table>tbody>tr'),
                    script = $(scripts['1']).html();
    
                this.get_script_codes(script);
                this.get_proxies(proxy_rows);
                this.check_proxies();
            })
            .catch(err=>console.log('Error occured ' + err ));
    }

    check_proxies(){
        this.proxies.map(()=>{
            const 
                pc = new proxyCheck(this);
            pc.check();
        });
    }
    
    get_script_codes($){        
        const 
            bodyScripts =$('body>script'),
            cipherScript = $(bodyScripts['1']).html(),
            scripts = cipherScript.split(';').slice(0,-1),
            codes = [],
            re = /(\d\^.+)/i;
        scripts.map((v)=>{
            const code = v.split('='),
                re_res = code[1].match(re);
            if(re_res !== null)
                codes.push({name:code[0], value:code[1].slice(0,1)});
        });
        codes.map((v)=>this.script_codes[v.name] = v.value);        
    }

    get_proxies(trs){
        let prox = this.proxies;
        trs.map(()=>{
            const 
                $ = cheerio.load(this),
                proxy = this.get_proxy_td($.find('td'));
            if(proxy === false)
                return;
            prox.push(this.clean_proxy(proxy));
        });
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

    clean_proxy(str){
        const 
            $ = cheerio.load(str);
        str = $(str);

        const
            ip = str.text(),
            script_cripted = str.children('script').html().split('+').slice(1);
        
        let 
            port = '';

        script_cripted.map((v)=>{
            port += this.script_codes[v.slice(1,-1).split('^')[0]];
        });

        return {ip:ip, port:port};
    }

}

module.exports = SpysOne;