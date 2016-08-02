"use strict";
var patata = require('../../index');
var hooks = function () {
    this.After(function () {
        return this.emu.resetApp();
    });
};
module.exports = hooks;
