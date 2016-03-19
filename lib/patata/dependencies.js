"use strict";

var wd = require("wd");

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
var _ = require('underscore');

exports.should = should;

exports.extensions = function(Patata, patata) {
    return function() {
        var extensions = require('require-dir')('./extensions');
        _.forEach(extensions, function(ext) { ext(Patata, patata); });
    }
}