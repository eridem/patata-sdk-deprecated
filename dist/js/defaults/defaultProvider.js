/// <reference path="../../typings/q/Q.d.ts" />
"use strict";
var Q = require('q');
var fs = require('fs');
var DefaultProvider = (function () {
    function DefaultProvider(patata, opts) {
        this._patata = patata;
        this._opts = opts;
        if (!this._opts.path) {
            throw this._patata.log.getError("[Default provider] File cannot be null");
        }
        return this;
    }
    DefaultProvider.prototype.getBin = function () {
        var deferred = Q.defer();
        var file = process.cwd() + '/' + this._opts.path;
        try {
            fs.statSync(file);
        }
        catch (err) {
            if (err.code == 'ENOENT') {
                throw this._patata.log.getError("[Default provider] file not found [" + file + "]");
            }
        }
        deferred.resolve(file);
        return deferred.promise;
    };
    return DefaultProvider;
}());
exports.DefaultProvider = DefaultProvider;
