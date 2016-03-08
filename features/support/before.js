"use strict";

var patata = require('../../lib/config/index');

var hooks = function () {
    this.Before(function (scenario) {              
        // Load config options file
        var options = require('../options.js');

        // Init
        return patata.start(this, scenario, options);
    });
};

module.exports = hooks;