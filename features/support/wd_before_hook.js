"use strict";
/* global global */

var configPath = '../config/';
var implicitWait = 3 * 1000;

var hooks = function () {
    this.Before(function (scenario) {
        global.scenario = scenario;
        
        // Load config options file
        var options = require('../options.js');
        
        // Use the config.js to configure different settings
        // And use ENV, APP and FLAVOUR environment variables to switch between configs
        return require(configPath + 'config')
            .init(options)
            .emulator()
            .attachClient(this)
            .logger()
            .capabilities()
            .provider(implicitWait);
    });
};

module.exports = hooks;