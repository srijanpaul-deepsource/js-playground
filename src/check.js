class Check {
  constructor(def) {
    this.nodesToVisit = [];
    for (const [key, fun] of Object.entries(def)) {
      this[key] = fun.bind(this);
      this.nodesToVisit.push(key);
    }
    this.cache = new Map();
    if (this.init) this.init(this.cache);
  }
}

module.exports = Check;
