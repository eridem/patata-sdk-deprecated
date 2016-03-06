"use strict";
/* global global */
/* global process */

var supportPath = '../support/';
var wdPath = supportPath + 'wd/';
var configPath = '../config/';
var implicitWait = 3 * 1000;

var hooks = function () {
    this.Before(function (scenario) {
        global.scenario = scenario;
        
        // Use the config.js to configure different settings
        // And use ENV, APP and FLAVOUR environment variables to switch between configs
        var config = require(configPath + 'config');
        var options = config.getOptions();
      
        // WebDriver: Emulator settings
        var serverConfig = require(configPath + 'servers')[options.SERVER];
        this.driver = require("wd").promiseChainRemote(serverConfig);
        
        // WebDriver: Setup dependencies
        require(wdPath + "wdsetup");
        
        // WebDriver: Logging
        require(wdPath + "logging").configure(this.driver);

        // WebDriver: API config
        var capabilities = config.getCapabilities(options);
        var desired = require(configPath + 'capabilities')[capabilities];
            
        // Provider
        var ProviderFactory = require(configPath + 'provider-factory');
        var provider = new ProviderFactory(this.driver, desired, implicitWait);  
        return provider.create();
    });
};

module.exports = hooks;