"use strict";

var patata = require('../../lib/config/index');

var hooks = function () {
    this.After(function () {
        return patata.quit();
    });
};

module.exports = hooks;