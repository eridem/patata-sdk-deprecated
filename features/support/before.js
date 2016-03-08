"use strict";
/* global global */

var configPath = '../../lib/config/';
var implicitWait = 3 * 1000;

var hooks = function () {
    this.Before(function (scenario) {
        global.scenario = scenario;
               
        // Load config options file
        var options = require('../options.js');
               
        // Init
        return require(configPath + 'index')
            .init(options)
            .emulator()
            .attachClient(this)
            .logger()
            .capabilities()
            .reports(scenario)
            .provider(implicitWait);
    });
};

module.exports = hooks;