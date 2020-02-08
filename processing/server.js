const fs = require('fs');
const http = require('http');

const slide = require('./slide');
const speech = require('./speech');

const Text = slide.Text;
const Bullet = slide.Bullet;
const Title = slide.Title;
const Next = slide.Next;
const SoftNext = slide.SoftNext;

let text = 'Welcome we are speak easy next slide my name is james moving on now let\'s talk about react welcome';

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

const keywordMappings = [
  {
    keywords: ['next', 'slide'],
    gen: (objs, words, i) => {
      objs.push(new Next());
      return 1;
    }
  },
  {
    keywords: ['moving', 'on', 'now'],
    gen: (objs, words, i) => {
      objs.push(new Next());
      return 2;
    }
  },
  {
    keywords: ['image'],
    gen: (objs, words, i) => {
      objs.push(new Text("Imge: " + words[i + 1]));
      return 1;
    }
  },
  {
    keywords: ['welcome'],
    gen: (objs, words, i) => {
      objs.push(new Title("Welcome!!!"));
      objs.push(new SoftNext());
      return 0;
    }
  },
  {
    keywords: ['we', 'are'],
    gen: (objs, words, i) => {
      objs.push(new Title("We are..."));
      return 1;
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

text = text.replace("\"", '').toLowerCase();

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

      if (curText != '') {
        objs.push(new Text(curText));
        curText = '';
      }

      i += mapping.gen(objs, words, i);

      break;
    }
  }

  if (!matched) {
    curText += ' ' + word;
  }
}

if (curText != '' ) objs.push(new Text(curText));

const slidesToMdx = (slides) => {
    let str = "---\ntitle: \"Simpsons\"\npath: /test\ndesc: d.\nlocation: l.\n---\n\nimport { Utils, FullscreenImage } from '../../src/components'\n";

    for (var i = 0; i < slides.length; i++) {
      const s = slides[i];
      console.log(i, slides.length - 1);
      str += s.toMdx(i == slides.length - 1);
    }

    return str;
};

const genSlides = (slides) => {
    fs.writeFile('../app/decks/test/tests.mdx', slidesToMdx(slides), function (err) {
        if (err) throw err;
    });
};

genSlides(objs);
