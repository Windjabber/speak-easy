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
    return "\n\n---\n\n";
  }
}

class SoftNext {
  toMdx(last) {
    console.log(last);
    return last ? '' : '\n\n---\n\n';
  }
}

module.exports = { Text, Bullet, Title, Next, SoftNext, UTILS, SLIDE_END };
