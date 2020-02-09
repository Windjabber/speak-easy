const UTILS = `<Utils />`

const SLIDE_END = `

${UTILS}

---

`;

String.prototype.toProperCase = function () {
    return this.trim().replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

class GifImage {
  constructor(keyword) {
    this.keyword = keyword
  }

  toMdx(last) {
    return `<GifImage keyword="${this.keyword.trim()}"/>\n`;
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
    return this.txt === '' ? '' : '*' + this.txt.trim() + '*' + '\n';
  }
}

class Bullet {
  constructor(points) {
    this.points = points;
  }

  toMdx(last) {
    let str = '';

    for (let point of this.points) {
      str += ' - ' + point.toUpperCase() + '\n';
    }

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

module.exports = { Text, Bullet, Title, Next, SoftNext, Italics, GifImage, UTILS, SLIDE_END };
