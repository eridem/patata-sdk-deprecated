"use strict";
var LoaderHelper = (function () {
    function LoaderHelper() {
    }
    LoaderHelper.prototype.loadAsFunctionModuleOrObject = function (what) {
        if (typeof what === 'function') {
            return what();
        }
        else if (typeof what === 'string') {
            return require(what);
        }
        return what;
    };
    LoaderHelper.prototype.obtainPlugin = function (what) {
        if (typeof what === 'string') {
            var objs = require(what);
            for (var attr in objs) {
                what = objs[attr];
            }
        }
        return what;
    };
    return LoaderHelper;
}());
exports.LoaderHelper = LoaderHelper;
