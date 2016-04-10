"use strict";
var Q = require('q');
var DefaultProvider = (function () {
    function DefaultProvider(opts) {
        this._opts = opts;
        return this;
    }
    DefaultProvider.prototype.getBin = function () {
        var deferred = Q.defer();
        deferred.resolve(this._opts.path);
        return deferred.promise;
    };
    return DefaultProvider;
}());
exports.DefaultProvider = DefaultProvider;
