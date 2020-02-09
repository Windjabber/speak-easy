const UTILS = `<Utils />`

const SLIDE_END = `

${UTILS}

---

`

class Text {
  constructor(txt) {
    this.txt = txt
  }

  toMdx(last) {
    return this.txt.trim() + '\n';
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
    console.log(last);
    return last ? '' : SLIDE_END;
  }
}

module.exports = { Text, Bullet, Title, Next, SoftNext, Italics, UTILS, SLIDE_END };
