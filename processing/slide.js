class Slide {
  constructor() {
    this.text = '';
  }

  setText(text) {
    this.text = text;
  }

  toMdx() {
    return '\n\n---\n\n' + this.text;
  }
};

module.exports = { Slide };
