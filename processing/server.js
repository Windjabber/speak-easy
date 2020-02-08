const fs = require('fs');
const http = require('http');

const summary = require('./processing');
const slide = require('./slide');
const speech = require('./speech');

const Slide = slide.Slide;
const Text = slide.Text;
const Bullet = slide.Bullet;
const Title = slide.Title;

let txt = '';

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log("Request received");

    // Dodgy routing code
    const url = req.url;
    if (url === '/start') {
        speech.startListening()
    }

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

        const first = newKeywords.pop();

        const t = new Title(first);
        slide.addObj(t);

        const b = new Bullet(newKeywords);
        slide.addObj(b);

        slides.push(slide);
    }

    // Generate mdx file
    genSlides(slides);

    oldSize = keywords.length;
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
