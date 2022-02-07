const http = require('http');
const port = 3000;
const fs = require('fs');

const server = http.createServer(function(req, res) {

    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });

}).listen(port);

console.log('Server Running at Port 3000 CNTL-C to quit');
console.log('To test with browser, visit http://localhost:3000');