"use strict";
var Configuration = (function () {
    function Configuration(path) {
        path = path || '';
        return this;
    }
    Object.defineProperty(Configuration.prototype, "capability", {
        get: function () {
            return this._capability;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "provider", {
        get: function () {
            return this._provider;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configuration.prototype, "servers", {
        get: function () {
            return this._servers;
        },
        enumerable: true,
        configurable: true
    });
    return Configuration;
}());
exports.Configuration = Configuration;
