"use strict";
var Log = (function () {
    function Log() {
    }
    Log.prototype.getMessage = function (message) {
        return "[Patata] " + message;
    };
    Log.prototype.getErrorMessage = function (message) {
        return "[Patata] " + message;
    };
    Log.prototype.getError = function (message) {
        return new Error(this.getErrorMessage(message));
    };
    return Log;
}());
exports.Log = Log;
