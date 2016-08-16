"use strict";
var fs = require('fs');
class DefaultProvider {
    constructor(patata, opts) {
        this._patata = patata;
        this._opts = opts;
        if (!this._opts.path) {
            throw this.log.getError(`[Default provider] File cannot be null`);
        }
        return this;
    }
    get log() { return this._patata.log; }
    getBin() {
        return new Promise((resolve, reject) => {
            let file = process.cwd() + '/' + this._opts.path;
            try {
                fs.statSync(file);
            }
            catch (err) {
                if (err.code == 'ENOENT') {
                    throw this.log.getError(`[Default provider] file not found [${file}]`);
                }
            }
            resolve(file);
        });
    }
}
exports.DefaultProvider = DefaultProvider;
