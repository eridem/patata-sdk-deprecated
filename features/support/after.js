"use strict";

var patata = require('../../lib/patata/patata');

var hooks = function () {
    this.After(function () {
        return patata.quit();
    });
};

module.exports = hooks;