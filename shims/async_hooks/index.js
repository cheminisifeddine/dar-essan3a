class AsyncLocalStorage {
  constructor() {
    this._store = undefined;
  }
  getStore() {
    return this._store;
  }
  run(store, callback, ...args) {
    const prev = this._store;
    this._store = store;
    try {
      return callback(...args);
    } finally {
      this._store = prev;
    }
  }
  exit(callback, ...args) {
    return this.run(undefined, callback, ...args);
  }
}

module.exports = {
  AsyncLocalStorage,
  default: { AsyncLocalStorage }
};
