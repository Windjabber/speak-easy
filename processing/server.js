const fs = require('fs');
const http = require('http');

const slide = require('./slide');
const speech = require('./speech');

const Text = slide.Text;
const Bullet = slide.Bullet;
const Title = slide.Title;
const Next = slide.Next;

let text = 'hello there next slide my name is james moving on now let\'s talk about react image cat hello';

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   console.log("Request received");
//
//   // Dodgy routing code
//   const url = req.url;
//   if (url === '/start') {
//       speech.startListening()
//   }
//
//   res.end();
// }).listen(8080);

const nextSlideKeywords = [['next', 'slide'], ['moving' ,'on']];

const keywordMappings = [
  {
    keywords: ['next', 'slide'],
    skip: 2,
    gen: (objs, words, i) => {
      objs.push(new Next())
    }
  },
  {
    keywords: ['moving', 'on', 'now'],
    skip: 2,
    gen: (objs, words, i) => {
      objs.push(new Next())
    }
  },
  {
    keywords: ['image'],
    skip: 2,
    gen: (objs, words, i) => {
      objs.push(new Text("Imge: " + words[i + 1]))
    }
  }
];

// setInterval(() => {
//
//
//   // const slideText = text.split(',');
//   //
//   // for (let text of slideText) {
//   //   const t = new Text(text.trim());
//   //
//   //   objs.push(t);
//   //
//   //   objs.push(new Next());
//   // }
//   //
//   // genSlides(objs);
// }, 1000);

const objs = [];

text = text.replace("\"", '');

let curText = '';
const words = text.split(" ");
for (var i = 0; i < words.length; i++) {
  let matched = false;
  const word = words[i];

  for (let mapping of keywordMappings) {
    let match = true;

    for (var j = 0; j < mapping.keywords.length; j++) {
      if (words[i + j] != mapping.keywords[j]) {
        match = false;
        break;
      }
    }

    if (match) {
      matched = true;
      i += mapping.skip - 1;

      if (curText != '') {
        objs.push(new Text(curText));
        curText = '';
      }

      mapping.gen(objs, words, i);

      break;
    }
  }

  if (!matched) {
    curText += ' ' + word;
  }
}

console.log(objs);

objs.push(new Text(curText));

const slidesToMdx = (slides) => {
    let str = "---\ntitle: \"Simpsons\"\npath: /test\ndesc: d.\nlocation: l.\n---\n\n";

    for (let s of slides) {
        str += s.toMdx();
    }

    return str;
};

console.log(slidesToMdx(objs));

const genSlides = (slides) => {
    fs.writeFile('../app/decks/test/tests.mdx', slidesToMdx(slides), function (err) {
        if (err) throw err;
    });
};
