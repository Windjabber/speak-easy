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

module.exports = { Slide, Text };
