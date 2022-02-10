const http = require('http');
const port = 3000;
const fs = require('fs');
const url = require('url');

const ROOT_DIR = 'public';

const MIME_TYPES = {
    css: "text/css",
    gif: "image/gif",
    htm: "text/html",
    html: "text/html",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    txt: "text/plain"
  };
   

function get_mime(filename) {
    let type
    for (let ext in MIME_TYPES) {
      type = MIME_TYPES[ext]
      if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
        return type
      }
    }
    return MIME_TYPES["txt"]
  }

const server = http.createServer(function(req, res) {

    let urlObj = url.parse(req.url, true, false);
    let filePath = ROOT_DIR + urlObj.pathname;

    console.log('\n============================');
	console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + filePath);
    console.log("METHOD: " + req.method);

    if(urlObj.pathname === '/') filePath = ROOT_DIR + '/index.html';
    
    fs.readFile(filePath, function(err, data) {
        if(err) {
            res.writeHead(404);
            res.write(err.message);
            res.end();
        }else{
            res.writeHead(200, {'Content-Type': get_mime(filePath)});
            res.end(data);
        }

        
       
        console.log('done');
    });

    

}).listen(port);

console.log('Server Running at Port 3000 CNTL-C to quit');
console.log('To test with browser, visit http://localhost:3000');