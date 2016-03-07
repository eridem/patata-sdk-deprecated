"use strict";

var configPath = '../../lib/config/';

var hooks = function () {
    this.After(function () {
        console.log("      WD".blue, "Quit".grey);
        return require(configPath + 'index').quit();
    });
};

module.exports = hooks;