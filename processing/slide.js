class Slide {
  constructor() {
    this.objs = [];
  }

  addObj(obj) {
    this.objs.push(obj);
  }

  toMdx() {
    let str = '\n\n---\n\n';

    for (let obj of this.objs) {
      str += obj.toMdx();
    }

    return str;
  }
};

class Text {
  constructor(txt) {
    this.txt = txt
  }

  toMdx() {
    return this.txt;
  }
}

class Bullet {
  constructor(points) {
    this.points = points;
  }

  toMdx() {
    let str = '';

    for (let point of this.points) {
      str += ' - ' + point + '\n';
    }

    return str;
  }
}

module.exports = { Slide, Text, Bullet };
