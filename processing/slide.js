const UTILS = `<Utils />`

const SLIDE_END = `
\n

${UTILS}

---

`;

String.prototype.toTitleCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
};

String.prototype.toProperCase = function () {
    return this.split(".").map(x => x.trim().toTitleCase()).join(". ");
};

class GifImage {
  constructor(keyword) {
    this.keyword = keyword
  }

  toMdx(last) {
    return `\n\n<GifImage keyword="${this.keyword.trim()}"/>\n\n`;
  }
}

class Text {
  constructor(txt) {
    this.txt = txt
  }

  toMdx(last) {
    return this.txt.toProperCase() + '\n';
  }
}

class Italics {
  constructor(txt) {
    this.txt = txt
  }

  toMdx(last) {
    return this.txt === '' ? '' : '*' + this.txt.toProperCase() + '*' + '\n';
  }
}

class BulletList {
  constructor(title, points) {
    this.title = title;
    this.points = points;
  }

  toMdx(last) {
    let str = this.title.toProperCase() + '\n';

    for (let point of this.points) {
      str += ' - ' + point.toProperCase() + '\n';
    }

    str += '\n\n';

    return str;
  }
}

class Title {
  constructor(txt) {
    this.txt = txt;
  }

  toMdx(last) {
    return "# " + this.txt.trim().toUpperCase() + '\n';
  }
}

class Next {
  toMdx(last) {
    return SLIDE_END;
  }
}

class SoftNext {
  toMdx(last) {
    return last ? '' : SLIDE_END;
  }
}

module.exports = { Text, BulletList, Title, Next, SoftNext, Italics, GifImage, UTILS, SLIDE_END };
