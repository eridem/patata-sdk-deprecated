"use strict";

var patata = require('../../js/index');

var hooks = function () {
    this.Before(function (scenario) {              
        // Init
        return patata.start(this, scenario);
    });
};

module.exports = hooks;