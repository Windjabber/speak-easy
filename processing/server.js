const fs = require('fs');
const http = require('http');

const slide = require('./slide');

const Slide = slide.Slide;
const Text = slide.Text;
const Bullet = slide.Bullet;
const Title = slide.Title;

let text = '';

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log("Request received");

  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);

    text = Buffer.concat(body).toString().toLowerCase();
  });

  res.end();
}).listen(8080);

const nextSlideKeywords = [['next slide'], ['moving on']];

setInterval(() => {
  const slides = [];
  text = text.replace("\"", '');

  // Split text into slides based off keyword
  for (let keyword of nextSlideKeywords) {
    text = text.split(keyword).join(',');
  }

  const slideText = text.split(',');

  for (let text of slideText) {
    const slide = new Slide();

    const t = new Text(text);

    slide.addObj(t);

    slides.push(slide);
  }

  genSlides(slides);
}, 1000);

const genSlides = (slides) => {
  fs.writeFile('../app/decks/test/tests.mdx', slidesToMdx(slides), function (err) {
    if (err) throw err;
  });
};

const slidesToMdx = (slides) => {
  let str = "---\ntitle: \"Simpsons\"\npath: /test\ndesc: d.\nlocation: l.";

  for (let s of slides) {
    str += s.toMdx();
  }

  return str;
};
