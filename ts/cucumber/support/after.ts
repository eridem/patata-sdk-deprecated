"use strict";

var patata = require('../../js/index');

var hooks = function () {
    this.After(function () {
        return patata.quit();
    });
};

module.exports = hooks;