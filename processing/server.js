const fs = require('fs');
const http = require('http');

const slide = require('./slide');
const speech = require('./speech');
const search = require('./search');

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
desc: d.
location: l.
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

const emojiMapping = {
    "bowtie": ":bowtie:",
    "smile": ":smile:",
    "laughing": ":laughing:",
    "blush": ":blush:",
    "smiley": ":smiley:",
    "relaxed": ":relaxed:",
    "smirk": ":smirk:",
    "flushed": ":flushed:",
    "relieved": ":relieved:",
    "satisfied": ":satisfied:",
    "grin": ":grin:",
    "wink": ":wink:",
    "grinning": ":grinning:",
    "kissing": ":kissing:",
    "sleeping": ":sleeping:",
    "worried": ":worried:",
    "frowning": ":frowning:",
    "anguished": ":anguished:",
    "grimacing": ":grimacing:",
    "confused": ":confused:",
    "hushed": ":hushed:",
    "expressionless": ":expressionless:",
    "unamused": ":unamused:",
    "sweat": ":sweat:",
    "weary": ":weary:",
    "pensive": ":pensive:",
    "disappointed": ":disappointed:",
    "confounded": ":confounded:",
    "fearful": ":fearful:",
    "persevere": ":persevere:",
    "cry": ":cry:",
    "sob": ":sob:",
    "joy": ":joy:",
    "astonished": ":astonished:",
    "scream": ":scream:",
    "neckbeard": ":neckbeard:",
    "angry": ":angry:",
    "rage": ":rage:",
    "triumph": ":triumph:",
    "sleepy": ":sleepy:",
    "yum": ":yum:",
    "mask": ":mask:",
    "sunglasses": ":sunglasses:",
    "imp": ":imp:",
    "innocent": ":innocent:",
    "alien": ":alien:",
    "heart": ":heart:",
    "heartbeat": ":heartbeat:",
    "heartpulse": ":heartpulse:",
    "cupid": ":cupid:",
    "sparkles": ":sparkles:",
    "star": ":star:",
    "star2": ":star2:",
    "dizzy": ":dizzy:",
    "boom": ":boom:",
    "collision": ":collision:",
    "anger": ":anger:",
    "exclamation": ":exclamation:",
    "question": ":question:",
    "zzz": ":zzz:",
    "dash": ":dash:",
    "notes": ":notes:",
    "fire": ":fire:",
    "hankey": ":hankey:",
    "poop": ":poop:",
    "shit": ":shit:",
    "thumbsup": ":thumbsup:",
    "thumbsdown": ":thumbsdown:",
    "punch": ":punch:",
    "facepunch": ":facepunch:",
    "fist": ":fist:",
    "v": ":v:",
    "wave": ":wave:",
    "hand": ":hand:",
    "pray": ":pray:",
    "clap": ":clap:",
    "muscle": ":muscle:",
    "metal": ":metal:",
    "fu": ":fu:",
    "walking": ":walking:",
    "runner": ":runner:",
    "running": ":running:",
    "couple": ":couple:",
    "family": ":family:",
    "dancer": ":dancer:",
    "dancers": ":dancers:",
    "bow": ":bow:",
    "couplekiss": ":couplekiss:",
    "massage": ":massage:",
    "haircut": ":haircut:",
    "boy": ":boy:",
    "girl": ":girl:",
    "woman": ":woman:",
    "man": ":man:",
    "baby": ":baby:",
    "cop": ":cop:",
    "angel": ":angel:",
    "princess": ":princess:",
    "guardsman": ":guardsman:",
    "skull": ":skull:",
    "feet": ":feet:",
    "lips": ":lips:",
    "kiss": ":kiss:",
    "droplet": ":droplet:",
    "ear": ":ear:",
    "eyes": ":eyes:",
    "nose": ":nose:",
    "tongue": ":tongue:",
    "feelsgood": ":feelsgood:",
    "finnadie": ":finnadie:",
    "goberserk": ":goberserk:",
    "godmode": ":godmode:",
    "hurtrealbad": ":hurtrealbad:",
    "rage1": ":rage1:",
    "rage2": ":rage2:",
    "rage3": ":rage3:",
    "rage4": ":rage4:",
    "suspect": ":suspect:",
    "trollface": ":trollface:",
    "sunny": ":sunny:",
    "umbrella": ":umbrella:",
    "cloud": ":cloud:",
    "snowflake": ":snowflake:",
    "snowman": ":snowman:",
    "zap": ":zap:",
    "cyclone": ":cyclone:",
    "foggy": ":foggy:",
    "ocean": ":ocean:",
    "cat": ":cat:",
    "dog": ":dog:",
    "mouse": ":mouse:",
    "hamster": ":hamster:",
    "rabbit": ":rabbit:",
    "wolf": ":wolf:",
    "frog": ":frog:",
    "tiger": ":tiger:",
    "koala": ":koala:",
    "bear": ":bear:",
    "pig": ":pig:",
    "cow": ":cow:",
    "boar": ":boar:",
    "monkey": ":monkey:",
    "horse": ":horse:",
    "racehorse": ":racehorse:",
    "camel": ":camel:",
    "sheep": ":sheep:",
    "elephant": ":elephant:",
    "snake": ":snake:",
    "bird": ":bird:",
    "chicken": ":chicken:",
    "penguin": ":penguin:",
    "turtle": ":turtle:",
    "bug": ":bug:",
    "honeybee": ":honeybee:",
    "ant": ":ant:",
    "beetle": ":beetle:",
    "snail": ":snail:",
    "octopus": ":octopus:",
    "fish": ":fish:",
    "whale": ":whale:",
    "whale2": ":whale2:",
    "dolphin": ":dolphin:",
    "cow2": ":cow2:",
    "ram": ":ram:",
    "rat": ":rat:",
    "tiger2": ":tiger2:",
    "rabbit2": ":rabbit2:",
    "dragon": ":dragon:",
    "goat": ":goat:",
    "rooster": ":rooster:",
    "dog2": ":dog2:",
    "pig2": ":pig2:",
    "mouse2": ":mouse2:",
    "ox": ":ox:",
    "blowfish": ":blowfish:",
    "crocodile": ":crocodile:",
    "leopard": ":leopard:",
    "cat2": ":cat2:",
    "poodle": ":poodle:",
    "bouquet": ":bouquet:",
    "tulip": ":tulip:",
    "rose": ":rose:",
    "sunflower": ":sunflower:",
    "hibiscus": ":hibiscus:",
    "leaves": ":leaves:",
    "herb": ":herb:",
    "mushroom": ":mushroom:",
    "cactus": ":cactus:",
    "chestnut": ":chestnut:",
    "seedling": ":seedling:",
    "blossom": ":blossom:",
    "shell": ":shell:",
    "moon": ":moon:",
    "volcano": ":volcano:",
    "octocat": ":octocat:",
    "squirrel": ":squirrel:",
    "bamboo": ":bamboo:",
    "dolls": ":dolls:",
    "flags": ":flags:",
    "fireworks": ":fireworks:",
    "sparkler": ":sparkler:",
    "ghost": ":ghost:",
    "santa": ":santa:",
    "gift": ":gift:",
    "bell": ":bell:",
    "tada": ":tada:",
    "balloon": ":balloon:",
    "cd": ":cd:",
    "dvd": ":dvd:",
    "camera": ":camera:",
    "computer": ":computer:",
    "tv": ":tv:",
    "iphone": ":iphone:",
    "phone": ":phone:",
    "telephone": ":telephone:",
    "pager": ":pager:",
    "fax": ":fax:",
    "minidisc": ":minidisc:",
    "vhs": ":vhs:",
    "sound": ":sound:",
    "speaker": ":speaker:",
    "mute": ":mute:",
    "loudspeaker": ":loudspeaker:",
    "mega": ":mega:",
    "hourglass": ":hourglass:",
    "watch": ":watch:",
    "radio": ":radio:",
    "satellite": ":satellite:",
    "loop": ":loop:",
    "mag": ":mag:",
    "unlock": ":unlock:",
    "lock": ":lock:",
    "key": ":key:",
    "bulb": ":bulb:",
    "flashlight": ":flashlight:",
    "battery": ":battery:",
    "calling": ":calling:",
    "email": ":email:",
    "mailbox": ":mailbox:",
    "postbox": ":postbox:",
    "bath": ":bath:",
    "bathtub": ":bathtub:",
    "shower": ":shower:",
    "toilet": ":toilet:",
    "wrench": ":wrench:",
    "hammer": ":hammer:",
    "seat": ":seat:",
    "moneybag": ":moneybag:",
    "yen": ":yen:",
    "dollar": ":dollar:",
    "pound": ":pound:",
    "euro": ":euro:",
    "envelope": ":envelope:",
    "door": ":door:",
    "smoking": ":smoking:",
    "bomb": ":bomb:",
    "gun": ":gun:",
    "hocho": ":hocho:",
    "pill": ":pill:",
    "syringe": ":syringe:",
    "scroll": ":scroll:",
    "clipboard": ":clipboard:",
    "calendar": ":calendar:",
    "date": ":date:",
    "scissors": ":scissors:",
    "pushpin": ":pushpin:",
    "paperclip": ":paperclip:",
    "pencil2": ":pencil2:",
    "notebook": ":notebook:",
    "ledger": ":ledger:",
    "books": ":books:",
    "bookmark": ":bookmark:",
    "microscope": ":microscope:",
    "telescope": ":telescope:",
    "newspaper": ":newspaper:",
    "football": ":football:",
    "basketball": ":basketball:",
    "soccer": ":soccer:",
    "baseball": ":baseball:",
    "tennis": ":tennis:",
    "8ball": ":8ball:",
    "bowling": ":bowling:",
    "golf": ":golf:",
    "bicyclist": ":bicyclist:",
    "snowboarder": ":snowboarder:",
    "swimmer": ":swimmer:",
    "surfer": ":surfer:",
    "ski": ":ski:",
    "spades": ":spades:",
    "hearts": ":hearts:",
    "clubs": ":clubs:",
    "diamonds": ":diamonds:",
    "gem": ":gem:",
    "ring": ":ring:",
    "trophy": ":trophy:",
    "violin": ":violin:",
    "dart": ":dart:",
    "mahjong": ":mahjong:",
    "clapper": ":clapper:",
    "memo": ":memo:",
    "pencil": ":pencil:",
    "book": ":book:",
    "art": ":art:",
    "microphone": ":microphone:",
    "headphones": ":headphones:",
    "trumpet": ":trumpet:",
    "saxophone": ":saxophone:",
    "guitar": ":guitar:",
    "shoe": ":shoe:",
    "sandal": ":sandal:",
    "lipstick": ":lipstick:",
    "boot": ":boot:",
    "shirt": ":shirt:",
    "tshirt": ":tshirt:",
    "necktie": ":necktie:",
    "dress": ":dress:",
    "jeans": ":jeans:",
    "kimono": ":kimono:",
    "bikini": ":bikini:",
    "ribbon": ":ribbon:",
    "tophat": ":tophat:",
    "crown": ":crown:",
    "briefcase": ":briefcase:",
    "handbag": ":handbag:",
    "pouch": ":pouch:",
    "purse": ":purse:",
    "eyeglasses": ":eyeglasses:",
    "coffee": ":coffee:",
    "tea": ":tea:",
    "sake": ":sake:",
    "beer": ":beer:",
    "beers": ":beers:",
    "cocktail": ":cocktail:",
    "pizza": ":pizza:",
    "hamburger": ":hamburger:",
    "fries": ":fries:",
    "spaghetti": ":spaghetti:",
    "curry": ":curry:",
    "bento": ":bento:",
    "sushi": ":sushi:",
    "rice": ":rice:",
    "ramen": ":ramen:",
    "stew": ":stew:",
    "oden": ":oden:",
    "dango": ":dango:",
    "egg": ":egg:",
    "bread": ":bread:",
    "doughnut": ":doughnut:",
    "custard": ":custard:",
    "icecream": ":icecream:",
    "birthday": ":birthday:",
    "cake": ":cake:",
    "cookie": ":cookie:",
    "candy": ":candy:",
    "lollipop": ":lollipop:",
    "apple": ":apple:",
    "tangerine": ":tangerine:",
    "lemon": ":lemon:",
    "cherries": ":cherries:",
    "grapes": ":grapes:",
    "watermelon": ":watermelon:",
    "strawberry": ":strawberry:",
    "peach": ":peach:",
    "melon": ":melon:",
    "banana": ":banana:",
    "pear": ":pear:",
    "pineapple": ":pineapple:",
    "eggplant": ":eggplant:",
    "tomato": ":tomato:",
    "corn": ":corn:",
    "house": ":house:",
    "school": ":school:",
    "office": ":office:",
    "hospital": ":hospital:",
    "bank": ":bank:",
    "hotel": ":hotel:",
    "wedding": ":wedding:",
    "church": ":church:",
    "tent": ":tent:",
    "factory": ":factory:",
    "japan": ":japan:",
    "sunrise": ":sunrise:",
    "stars": ":stars:",
    "rainbow": ":rainbow:",
    "fountain": ":fountain:",
    "ship": ":ship:",
    "speedboat": ":speedboat:",
    "boat": ":boat:",
    "sailboat": ":sailboat:",
    "rowboat": ":rowboat:",
    "anchor": ":anchor:",
    "rocket": ":rocket:",
    "airplane": ":airplane:",
    "helicopter": ":helicopter:",
    "tram": ":tram:",
    "bike": ":bike:",
    "tractor": ":tractor:",
    "car": ":car:",
    "taxi": ":taxi:",
    "bus": ":bus:",
    "ambulance": ":ambulance:",
    "minibus": ":minibus:",
    "truck": ":truck:",
    "train": ":train:",
    "station": ":station:",
    "train2": ":train2:",
    "monorail": ":monorail:",
    "trolleybus": ":trolleybus:",
    "ticket": ":ticket:",
    "fuelpump": ":fuelpump:",
    "warning": ":warning:",
    "construction": ":construction:",
    "beginner": ":beginner:",
    "atm": ":atm:",
    "busstop": ":busstop:",
    "barber": ":barber:",
    "hotsprings": ":hotsprings:",
    "moyai": ":moyai:",
    "jp": ":jp:",
    "kr": ":kr:",
    "cn": ":cn:",
    "us": ":us:",
    "fr": ":fr:",
    "es": ":es:",
    "it": ":it:",
    "ru": ":ru:",
    "gb": ":gb:",
    "uk": ":uk:",
    "de": ":de:",
    "one": ":one:",
    "two": ":two:",
    "three": ":three:",
    "four": ":four:",
    "five": ":five:",
    "six": ":six:",
    "seven": ":seven:",
    "eight": ":eight:",
    "nine": ":nine:",
    "1234": ":1234:",
    "zero": ":zero:",
    "hash": ":hash:",
    "symbols": ":symbols:",
    "abcd": ":abcd:",
    "abc": ":abc:",
    "arrow": ":arrow_right:",
    "rewind": ":rewind:",
    "ok": ":ok:",
    "repeat": ":repeat:",
    "new": ":new:",
    "top": ":top:",
    "up": ":up:",
    "cool": ":cool:",
    "free": ":free:",
    "ng": ":ng:",
    "cinema": ":cinema:",
    "koko": ":koko:",
    "sa": ":sa:",
    "restroom": ":restroom:",
    "mens": ":mens:",
    "womens": ":womens:",
    "baby": ":baby_symbol:",
    "smoking": ":no_smoking:",
    "parking": ":parking:",
    "wheelchair": ":wheelchair:",
    "metro": ":metro:",
    "baggage": ":baggage_claim:",
    "accept": ":accept:",
    "wc": ":wc:",
    "secret": ":secret:",
    "congratulations": ":congratulations:",
    "m": ":m:",
    "passport": ":passport_control:",
    "luggage": ":left_luggage:",
    "customs": ":customs:",
    "cl": ":cl:",
    "sos": ":sos:",
    "id": ":id:",
    "underage": ":underage:",
    "bicycles": ":no_bicycles:",
    "pedestrians": ":no_pedestrians:",
    "children": ":children_crossing:",
    "entry": ":no_entry:",
    "heart": ":heart_decoration:",
    "vs": ":vs:",
    "chart": ":chart:",
    "aries": ":aries:",
    "taurus": ":taurus:",
    "gemini": ":gemini:",
    "cancer": ":cancer:",
    "leo": ":leo:",
    "virgo": ":virgo:",
    "libra": ":libra:",
    "scorpius": ":scorpius:",
    "sagittarius": ":sagittarius:",
    "capricorn": ":capricorn:",
    "aquarius": ":aquarius:",
    "pisces": ":pisces:",
    "ophiuchus": ":ophiuchus:",
    "b": ":b:",
    "ab": ":ab:",
    "o2": ":o2:",
    "recycle": ":recycle:",
    "end": ":end:",
    "on": ":on:",
    "soon": ":soon:",
    "copyright": ":copyright:",
    "registered": ":registered:",
    "tm": ":tm:",
    "bangbang": ":bangbang:",
    "interrobang": ":interrobang:",
    "100": ":100:",
    "link": ":link:",
    "trident": ":trident:",
    "shipit": ":shipit:"
};

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
        keywords: ['show', 'me'],
        gen: (objs, words, i) => {
            objs.push(new GifImage(words[i + 2]));
            return 3;
        }
    },
    {
        keywords: ['show'],
        gen: (objs, words, i) => {
            objs.push(new GifImage(words[i + 1]));
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
            if (objs.length - 1 >= i + 2) {
                objs.push(new Italics(words[i + 2]));
            }
            return 2;
        }
    }
];

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
                matched = true;

                if (curText !== '') {
                    objs.push(new Text(curText));
                    curText = '';
                }

                i += mapping.gen(objs, words, i);

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
    return objs;
};

const updateLoop = async () => {
    const text = phrases.join(' ');
    const objs = await parse(text);
    await genSlides(objs);
};

const objsToMdx = (slides) => {
    let str = header;

    for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        str += s.toMdx (i === slides.length - 1);
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
