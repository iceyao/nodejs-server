var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var mimeList = require('./mimeList'); //静态文档类型映射表

var ROOT = 'static'; //文档存放根目录

var server = http.createServer(function(request, response){
    var pathname = url.parse(request.url).pathname;
    //简单的默认主页判断(这里只考虑index.html这种情况的默认主页)
    if(pathname == '/'){
        pathname = '/index.html';
    }
    var filePath = path.join(ROOT, pathname);
    //判断该文档是否存在
    fs.stat(filePath, function(err, stats){
        if(stats && stats.isFile()){
            var type = path.extname(pathname).slice(1);
            var mime = mimeList.mime[type];
            if(!mime){
                console.log('response file type error');
            }
            response.writeHead(200, {'Content-Type': mime}); //根据静态文档类型匹配输出类型
            fs.createReadStream(filePath).pipe(response);
        }else{
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('request url ' + filePath + ' is not found');
            response.end();
        }
    })
});
server.listen(8888);