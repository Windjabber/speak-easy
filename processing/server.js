const fs = require('fs');
const http = require('http');

const summary = require('./processing');
const Slide = require('./slide').Slide;
const Text = require('./slide').Text;
const Bullet = require('./slide').Bullet;

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
let slides = [];

setInterval(() => {
  const keywords = summary.summary(txt);

  console.log("Keywords : " + keywords);

  if (oldSize < keywords.length) {
    const newKeywords = keywords.slice(oldSize, keywords.length);

    const slide = new Slide();

    const b = new Bullet(newKeywords);

    slide.addObj(b);

    slides.push(slide);
  }

  fs.writeFile('../app/decks/test/tests.mdx', slidesToMdx(slides), function (err) {
    if (err) throw err;
    console.log(err);
  });

  oldSize = keywords.length;
}, 1000);

const slidesToMdx = (slides) => {
  let str = "---\ntitle: \"Simpsons\"\npath: /test\ndesc: d.\nlocation: l.";

  for (let s of slides) {
    str += s.toMdx();
  }

  return str;
};
