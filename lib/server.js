var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var mime = require('./mime'); //静态文档类型映射表

var ROOT = 'static'; //文档存放根目录

var server = http.createServer(function(request, response){
    var pathname = url.parse(request.url).pathname;
    //简单的默认主页判断(这里只考虑index.html这种情况的默认主页)
    if(pathname.slice(-1) === '/'){
        pathname += 'index.html';
    }
    var filePath = path.join(ROOT, pathname);
    //判断该文档是否存在
    fs.stat(filePath, function(err, stats){
        if(stats && stats.isFile()){
            var ext = path.extname(pathname).slice(1);
            var contentType = mime[ext] || 'application/octet-stream';
            response.writeHead(200, {'Content-Type': contentType}); //根据静态文档类型匹配输出类型
            fs.createReadStream(filePath).pipe(response);
        }else{
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('request url ' + request.url + ' is not found');
        }
    })
});
server.listen(8888);