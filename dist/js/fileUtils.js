"use strict";
var FileUtils = (function () {
    function FileUtils() {
    }
    FileUtils.prototype.generateResultsFilePath = function (extension) {
        return this.generateFilePath('./results-', extension);
    };
    FileUtils.prototype.generateFilePath = function (prefix, extension) {
        return prefix + new Date().toISOString()
            .replace(/[-|:|Z|\.]/gi, '')
            .replace(/T/gi, '-') + '.' + extension;
    };
    return FileUtils;
}());
exports.FileUtils = FileUtils;
