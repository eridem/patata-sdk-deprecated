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
        var envArg = process.env.ENV || 'android';
        var appArg = process.env.APP;
        var flaArg = process.env.FLAVOUR;
        var serArg = process.env.SERVER || "local";
        
        console.log("      CONFIG".blue, "Env".green, envArg.gray);
        console.log("      CONFIG".blue, "App".green, appArg.gray);
        console.log("      CONFIG".blue, "Flavour".green, flaArg.gray);
        console.log("      CONFIG".blue, "Server".green, serArg.gray);
                
        // Use the flavours.js to configure different settings
        // And use ENV, APP and FLAVOUR environment variables to switch between configs
        var config = require(configPath + 'config');
        
        // WebDriver: Emulator settings
        var serverConfig = require(configPath + 'servers')[serArg];
        this.driver = require("wd").promiseChainRemote(serverConfig);
        
        // WebDriver: Setup dependencies
        require(wdPath + "wdsetup");
        
        // WebDriver: Logging
        require(wdPath + "logging").configure(this.driver);

        // WebDriver: API config
        var capabilities = config.getCapabilities(envArg, appArg);
        var desired = require(configPath + 'capabilities')[capabilities];
            
        // Prepare callback
        var Q = require('q');
        var deferred = Q.defer();
            
        // WebDriver: Get binary from provider
        config.getBinary(envArg, appArg, flaArg).then(
            (function (desired, driver) {
                return function (url) {
                    console.log("      WD".blue, "Init".grey);

                    // Attach app url (http or file)
                    desired.app = url;       
                    
                    // WebDriver: Init
                    driver
                        .init(desired)
                        .setImplicitWaitTimeout(implicitWait)
                    
                    .then(function() {
                        deferred.resolve();
                    });
                };
            })(desired, this.driver));

        return deferred.promise;
    });
};

module.exports = hooks;