var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log("Request received");

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);

    console.log(Buffer.concat(body).toString());
  });
  
  res.end();
}).listen(8080);
