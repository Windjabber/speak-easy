const slide = require('./slide');

const Text = slide.Text;
const Bullet = slide.Bullet;
const Title = slide.Title;
const Next = slide.Next;
const SoftNext = slide.SoftNext;
const Italics = slide.Italics;
const GifImage = slide.GifImage;

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
            if (i + 2 >= words.length) return -1;
            objs.push(new GifImage(words[i + 2]));
            return 3;
        }
    },
    {
        keywords: ['show'],
        gen: (objs, words, i) => {
            if (i + 1 >= words.length) return -1;
            objs.push(new GifImage(words[i + 1]));
            return 1;
        }
    },
    {
        keywords: ['welcome'],
        gen: (objs, words, i) => {
            objs.push(new Title("Welcome!"));
            objs.push(new SoftNext());
            return 0;
        }
    },
    {
        keywords: ['thank', 'you'],
        gen: (objs, words, i) => {
            objs.push(new Next());
            objs.push(new Title("Thank you!"));
            objs.push(new Text("Any questions?"));
            objs.push(new SoftNext());
            return 1;
        }
    },
    {
        keywords: ['we', 'are'],
        gen: (objs, words, i) => {
            objs.push(new Title("We are..."));
            if (i + 2 >= words.length) return -1;
            if (objs.length - 1 >= i + 2) {
                objs.push(new Italics(words[i + 2]));
            }
            return 2;
        }
    },
    {
        keywords: ['end', 'presentation'],
        gen: (objs, words, i) => {
            objs.push(new Title("Thank you!"));
            return 1;
        }
    }
];

module.exports = keywordMappings;
