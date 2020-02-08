const UTILS = `<Utils />`

const SLIDE_END = `

${UTILS}

---

`

class Text {
  constructor(txt) {
    this.txt = txt
  }

  toMdx() {
    return this.txt.trim() + '\n';
  }
}

class Bullet {
  constructor(points) {
    this.points = points;
  }

  toMdx() {
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

  toMdx() {
    return "# " + this.txt.trim().toUpperCase() + '\n';
  }
}

class Next {
  toMdx() {
    return SLIDE_END;
  }
}

module.exports = { Text, Bullet, Title, Next, UTILS, SLIDE_END };
