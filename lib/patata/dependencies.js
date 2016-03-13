"use strict";

var wd = require("wd");

require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

exports.should = should;

exports.extensions = function(Patata, patata) {
    return function() {
        for (var i = 0; i < arguments.length; i++) {
            require('./patata-' + arguments[i])(Patata, patata);
        }
    }
}