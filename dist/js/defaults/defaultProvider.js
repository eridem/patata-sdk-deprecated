/// <reference path="../../typings/q/Q.d.ts" />
"use strict";
const Q = require('q');
class DefaultProvider {
    constructor(opts) {
        this._opts = opts;
        return this;
    }
    getBin() {
        var deferred = Q.defer();
        deferred.resolve(process.cwd() + '/' + this._opts.path);
        return deferred.promise;
    }
}
exports.DefaultProvider = DefaultProvider;
