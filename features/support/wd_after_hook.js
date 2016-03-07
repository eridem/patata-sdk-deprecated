"use strict";

var configPath = '../config/';

var hooks = function () {
    this.After(function () {
        console.log("      WD".blue, "Quit".grey);
        return require(configPath + 'config').quit();
    });
};

module.exports = hooks;