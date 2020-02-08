const summary = require('./processing');
const fs = require('fs');

//console.log(summary);

var http = require('http');

let txt = '';

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log("Request received");

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);

    txt = Buffer.concat(body).toString().toLowerCase();
  });

  res.end();
}).listen(8080);

let oldSize = 0;

setInterval(() => {
  const keywords = summary.summary(txt);

  console.log(keywords);

  if (oldSize < keywords.length) {
    appendTxt(keywords.slice(oldSize, keywords.length).toString());
  }

  oldSize = keywords.length;
}, 1000);

const appendTxt = (txt) => {
  console.log("Appending");
  fs.appendFile('../app/decks/Riff/slides.mdx', '\n---\n' + txt, function (err) {
    if (err) throw err;
    console.log(err);
  });
};
