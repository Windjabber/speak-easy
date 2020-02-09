const fs = require('fs');
const http = require('http');

const slide = require('./slide');
const speech = require('./speech');
const search = require('./search');

const emojiMapping = require('./emojis');
const keywordMappings = require('./keyphrases');
console.log(emojiMapping);
console.log(keywordMappings);

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const {IamAuthenticator} = require('ibm-watson/auth');

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
const GifImage = slide.GifImage;
const UTILS = slide.UTILS;

const phrases = [];

let header = `---
title: \"Let's Riff!\"
path: /riff
---

import { Utils, FullscreenImage, GifImage } from '../../src/components'

`;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log("Request received");

    // Dodgy routing code
    const url = req.url;
    if (url === '/start') {

        search.sendQuery().then(imageResults => {
            if (imageResults == null) {
                console.log("No image results were found.");
            } else {
                console.log(`Total number of images returned: ${imageResults.value.length}`);
                let firstImageResult = imageResults.value[0];
                //display the details for the first image result. After running the application,
                //you can copy the resulting URLs from the console into your browser to view the image.
                console.log(`Total number of images found: ${imageResults.value.length}`);
                console.log(`Copy these URLs to view the first image returned:`);
                console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
                console.log(`First image content url: ${firstImageResult.contentUrl}`);
            }
        })
            .catch(err => console.error(err))
        speech.startListening(phrases);
        setInterval(updateLoop, 1000);
    }

    res.end();
}).listen(8080);

let lastSeenText = "";
let lastSeenRoles = [];

const getSemanticRoles = async (text) => {
    if (text.length < 20) {
        return false;
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

    let res = null;
    try {
        res = await naturalLanguageUnderstanding.analyze(analyzeParams);
    } catch (err) {
        console.log(err);
    }
    console.log("Res " + res);
    // Process output
    lastSeenText = text;
    lastSeenRoles = res["result"]["semantic_roles"];
    return lastSeenRoles;
};

const processSemanticRoles = (semanticRoles) => {
    let objs = [];
    semanticRoles.forEach(semanticRole => {
        console.log("Semantic role ", semanticRole);
        objs.push(new Text(semanticRole["subject"]["text"]));
        objs.push(new Bullet([semanticRole["action"]["text"] + ' ' + semanticRole["object"]["text"]]))
    });
    return objs;
};

const parse = async (text) => {
    const objs = [];

    let processedText = text.replace("\"", '').replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();

    let curText = '';
    const words = processedText.split(" ");
    for (let i = 0; i < words.length; i++) {
        let matched = false;
        const word = words[i];

        for (let mapping of keywordMappings) {
            let match = true;

            for (let j = 0; j < mapping.keywords.length; j++) {
                if (words[i + j] !== mapping.keywords[j]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                const r = mapping.gen(objs, words, i);
                if (r === -1) {
                  break;
                }
                
                matched = true;

                if (curText !== '') {
                    objs.push(new Text(curText));
                    curText = '';
                }

                i += r

                break;
            }

          if (word.trim() in emojiMapping) {
            if (curText !== '') {
              objs.push(new Text(curText))
              curText = '';
            }
            objs.push(new Text(emojiMapping[word]))
            matched = true;
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
            let semanticObjs = processSemanticRoles(semanticRoles);
            semanticObjs.forEach(semanticObj => {
                objs.push(semanticObj)
            })
        } else {
            objs.push(Promise.resolve(new Text(curText)));
        }
    }

    objs.push(Promise.resolve(new SoftNext()));

    return objs;
};

const updateLoop = async () => {
    let objs = [];

    for (let phrase of phrases) {
        const o = await parse(phrase);
        objs = objs.concat(o);
    }

    await genSlides(objs);
};

const objsToMdx = (slides) => {
    let str = header;

    for (let i = 0; i < slides.length; i++) {
        const s = slides[i];

        let restSoft = true;

        for (let j = i; j < slides.length; j++) {
          if (!(slides[j] instanceof SoftNext)) {
            restSoft = false;
            break;
          }
        }

        str += s.toMdx (restSoft);
        str += '\n';
    }

    str += UTILS;

    return str;
};

const genSlides = async (objs) => {
    let allObjs = await Promise.all(objs);
    fs.writeFile('../app/decks/riff/slides.mdx', objsToMdx(allObjs), function (err) {
        if (err) throw err;
    });
};
