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
    return " # " + this.txt.trim().toUpperCase() + '\n';
  }
}

class Next {
  toMdx() {
    return "\n\n---\n\n";
  }
}

module.exports = { Text, Bullet, Title, Next };
