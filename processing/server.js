const fs = require('fs');
const http = require('http');

const slide = require('./slide');
const speech = require('./speech');
const search = require('./search');

const emojiMapping = require('./emojis');
const keywordMappings = require('./keyphrases');

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const {IamAuthenticator} = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2019-07-12',
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_WATSON_NATURAL_LANGUAGE_KEY,
    }),
    url: 'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/0c236b5e-6172-4b95-9ba1-f98be60cac0c',
});

const Text = slide.Text;
const BulletList = slide.BulletList;
const Title = slide.Title;
const Next = slide.Next;
const SoftNext = slide.SoftNext;
const Italics = slide.Italics;
const GifImage = slide.GifImage;
const UTILS = slide.UTILS;

const phrases = [];
var title = "riff";

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    console.log("Request received");

    // Dodgy routing code
    const url = req.url;
    if (url.indexOf("/start") !== -1) {

        possibleTitle = url.substring(url.lastIndexOf('/') + 1);
        if (possibleTitle !== "") {
            title = possibleTitle;
            fs.mkdirSync(`../app/decks/${title}/`, {recursive: true}, (error) => {
                if (error) {
                    console.error('Error occured: ', error);
                } else {
                    console.log(`Your directory is made ../app/decks/${title}/`);
                }
            })
        }

        // search.sendQuery().then(imageResults => {
        //     if (imageResults == null) {
        //         console.log("No image results were found.");
        //     } else {
        //         console.log(`Total number of images returned: ${imageResults.value.length}`);
        //         let firstImageResult = imageResults.value[0];
        //         //display the details for the first image result. After running the application,
        //         //you can copy the resulting URLs from the console into your browser to view the image.
        //         console.log(`Total number of images found: ${imageResults.value.length}`);
        //         console.log(`Copy these URLs to view the first image returned:`);
        //         console.log(`First image thumbnail url: ${firstImageResult.thumbnailUrl}`);
        //         console.log(`First image content url: ${firstImageResult.contentUrl}`);
        //     }
        // })
        //     .catch(err => console.error(err))
        speech.startListening(phrases);
        setInterval(updateLoop, 1000);
    }

    res.end();
}).listen(8080);

let lastSeenText = "";
let lastSeenAnalysis = [];

const getSemanticRoles = async (text) => {
    if (text.length < 20) {
        return false;
    }
    if (lastSeenText === text) {
        return lastSeenAnalysis;
    }
    console.log("Issuing request for: ", text);
    const analyzeParams = {
        'features': {
            'semantic_roles': {},
            'keywords': {
                'emotion': true
            }
        },
        'text': `${text}`,
        'language': 'en',
    };

    let res = null;
    try {
        res = await naturalLanguageUnderstanding.analyze(analyzeParams);
    } catch (err) {
        console.log(err);
    }
    // Process output
    lastSeenText = text;
    lastSeenAnalysis = res["result"];
    return lastSeenAnalysis;
};

const emotion_to_colour = {
    "sadness": "is-blue",
    "joy": "is-green",
    "anger": "is-red"
};

function extractColouredWords(analysis) {
    let colouredWords = {};
    for (let i = 0; i < analysis["keywords"].length; i++) {
        let keyword = analysis["keywords"][i];
        let words = keyword["text"].split(" ");
        if (!"emotion" in keyword) {
            continue;
        }
        for (let emotion in emotion_to_colour) {
            if (keyword["emotion"][emotion] > 0.5) {
                if (!(emotion_to_colour[emotion] in colouredWords)) {
                    colouredWords[emotion_to_colour[emotion]] = [];
                }
                words.forEach(word => {
                    colouredWords[emotion_to_colour[emotion]].push(word)
                });
            }
        }
    }
    return colouredWords;
}

const processAnalysis = (analysis) => {
    let objs = [];
    let bulletLists = {};
    let lastBullet = "";
    for (let i = 0; i < analysis["semantic_roles"].length; i++) {
        let semanticRole = analysis["semantic_roles"][i];
        if (!"text" in semanticRole["subject"]) {
            return;
        }
        const subject = semanticRole["subject"]["text"];
        const point = semanticRole["action"]["text"] + ' ' + semanticRole["object"]["text"];
        if (subject in bulletLists) {
            bulletLists[subject].push(point);
            lastBullet = subject;
        } else if (subject.toLowerCase() === "it" && lastBullet in bulletLists) {
            bulletLists[lastBullet].push(point);
        } else {
            bulletLists[subject] = [point];
            lastBullet = subject;
        }
    }
    for (let s in bulletLists) {
        let points = bulletLists[s];
        for (let i = 0; i < points.length; i++) {
            objs.push(new BulletList(s, [points[i]]));
        }
    }

    return objs;
};

const parse = async (text) => {
    let objs = [];
    
    let caseWords = text.split(" ");

    let processedText = text.replace("\"", '').replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();

    let curText = '';
    const words = processedText.split(" ").slice();
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
                let newObjs = [];
                const r = mapping.gen(newObjs, words, i);

                if (r !== -1) {
                  matched = true;

                  if (curText !== '') {
                      objs.push(new Text(curText));
                      curText = '';
                  }

                  objs = objs.concat(newObjs);

                  i += r
                }
            }

            if (word.trim() in emojiMapping) {
                if (curText !== '') {
                    objs.push(new Text(curText));
                    curText = '';
                }
                objs.push(new Text(emojiMapping[word]));
                matched = true;
                break;
            }
        }

        if (!matched) {
            curText += ' ' + caseWords[i];
        }
    }

    if (curText !== '') {
        try {

            let semanticRoles = await getSemanticRoles(curText);
            if (semanticRoles) {
                let semanticObjs = processAnalysis(semanticRoles);
                semanticObjs.forEach(semanticObj => {
                    objs.push(semanticObj)
                })
            } else {
                objs.push(Promise.resolve(new Text(curText)));
            }
        } catch {
            console.log("Failed to retrieve semantic roles")
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
    console.log(slides);

    let str = `---
title: \"Let's Riff on: ${title}\"
path: /${title}
---

import { Utils, FullscreenImage, GifImage } from '../../src/components'

`;

    for (let i = 0; i < slides.length; i++) {
        const s = slides[i];

        let restSoft = true;

        for (let j = i; j < slides.length; j++) {
            if (!(slides[j] instanceof SoftNext)) {
                restSoft = false;
                break;
            }
        }

        str += s.toMdx(restSoft);
        str += '\n';
    }

    str += UTILS;

    return str;
};

const genSlides = async (objs) => {
    let allObjs = await Promise.all(objs);
    fs.writeFile(`../app/decks/${title}/slides.mdx`, objsToMdx(allObjs), function (err) {
        if (err) throw err;
    });
};
