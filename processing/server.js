const fs = require('fs');
const http = require('http');

const slide = require('./slide');
const speech = require('./speech');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  authenticator: new IamAuthenticator({
    apikey: '_bVh3Ed2RN57gsK9Yj-_CrWBfoAWtBpxVcSRec4h9IND',
  }),
  url: 'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/0c236b5e-6172-4b95-9ba1-f98be60cac0c',
});

const Text = slide.Text;
const Bullet = slide.Bullet;
const Title = slide.Title;
const Next = slide.Next;
const SoftNext = slide.SoftNext;
const Italics = slide.Italics;
const UTILS = slide.UTILS;

const phrases = [];

let header = `---
title: \"Simpsons\"
path: /riff
desc: d.
location: l.
---

import { Utils, FullscreenImage } from '../../src/components'

`;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log("Request received");

    // Dodgy routing code
    const url = req.url;
    if (url === '/start') {
        speech.startListening(phrases);
        setInterval(updateLoop, 1000);
    }

    res.end();
}).listen(8080);

const keywordMappings = [
    {
        keywords: ['go', 'back'],
        gen: (objs, words, i) => {
            objs.pop();
            phrases.pop();
            return 1;
        }
    },
    {
        keywords: ["reset"],
        gen: (objs, words, i) => {
            // Clear the arrays
            while (objs.length) {
                objs.pop();
            }
            while (phrases.length) {
                phrases.pop();
            }
            return 0;
        }
    },
    {
        keywords: ['next', 'slide'],
        gen: (objs, words, i) => {
            objs.push(new Next());
            return 1;
        }
    },
    // Special case because it keeps misclassifying this!,
    {
        keywords: ['next', 'flight'],
        gen: (objs, words, i) => {
            objs.push(new Next());
            return 1;
        }
    },
    {
        keywords: ['hello'],
        gen: (objs, words, i) => {
            objs.push(new Text('Hello! 👋'));
            return 0;
        }
    },
    {
        keywords: ['lets', 'continue', 'on'],
        gen: (objs, words, i) => {
            objs.push(new Next());
            return 2;
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
        keywords: ['moving', 'on'],
        gen: (objs, words, i) => {
            objs.push(new Next());
            return 1;
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
        keywords: ['thank', 'you'],
        gen: (objs, words, i) => {
            objs.push(new Next());
            objs.push(new Title("Thank you!!!"));
            objs.push(new Text("Any questions?"));
            objs.push(new SoftNext());
            return 1;
        }
    },
    {
        keywords: ['we', 'are'],
        gen: (objs, words, i) => {
            objs.push(new Title("We are..."));
            // This will crash if there is no word here....
            objs.push(new Italics(words[i + 2]));
            return 2;
        }
    }
];

let lastSeenText = "";
let lastSeenRoles = [];

const getSemanticRoles = async (text) => {
  if (text.length < 20) {
    return [];
  }
  if (lastSeenText === text) {
    return lastSeenRoles;
  }
  console.log("Issuing request for: ", text);
  const analyzeParams = {
    'features': {
      'semantic_roles': {}
    },
    'text': `${text}`
  };
  return await naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(res => {
      // Process output
      lastSeenText = text;
      lastSeenRoles = res["result"]["semantic_roles"];
      return lastSeenRoles;
    })
    .catch(err => {
      console.log('error:', err);
    });
};

const processSemanticRoles = (semanticRoles) => {
  let objs = [];
  semanticRoles.forEach(semanticRole => {
    objs.push(new Text(semanticRole["subject"]["text"]));
    objs.push(new Bullet([semanticRole["action"]["text"] + semanticRole["object"]["text"]]))
  });
  return objs;
};

const parse = async (text) => {
  const objs = [];

  text = text.replace("\"", '').replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();

  let curText = '';
  const words = text.split(" ");
  for (var i = 0; i < words.length; i++) {
    let matched = false;
    const word = words[i];

    for (let mapping of keywordMappings) {
      let match = true;

      for (var j = 0; j < mapping.keywords.length; j++) {
        if (words[i + j] !== mapping.keywords[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        matched = true;

        if (curText !== '') {
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

  if (curText !== '') {
    let semanticRoles = await getSemanticRoles(curText);
    if (semanticRoles) {
      let semantic_objs = processSemanticRoles(semanticRoles);
      semantic_objs.forEach(semantic_obj => {
        objs.push(semantic_obj)
      })
    } else {
      objs.push(new Text(curText));
    }
  }
  console.log(objs);
  return objs;
};

const updateLoop = () => {
    console.log(phrases);
    const text = phrases.join(' ');
    const objs = parse(text);
    genSlides(objs);
};

const slidesToMdx = (slides) => {
    let str = header;

    for (var i = 0; i < slides.length; i++) {
        const s = slides[i];
        str += s.toMdx(i === slides.length - 1);
    }

    str += UTILS;

    return str;
};

const genSlides = (slides) => {
    fs.writeFile('../app/decks/test/tests.mdx', slidesToMdx(slides), function (err) {
        if (err) throw err;
    });
};
