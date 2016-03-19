"use strict";
/* global process */

/**
 * Needed references
 */
var dependencies = require('./dependencies');
var _ = require('underscore');
require('../utils/actions');

function Patata() {}
var patata = new Patata();

Patata.prototype.init = function(config) {
    this.setConfig(config);
    return this;
};

/*
 * Options are the arguments that the user send via Environment Variables
 */
Patata.prototype.getOptions = function () {
    if (this.options) {
        return this.options;
    } else {
        this.options = {
            ENV: process.env.ENV || 'android',
            APP: process.env.APP,
            FLAVOUR: process.env.FLAVOUR,
            SERVER: process.env.SERVER || "local"
        };

        console.log("      CONFIG".blue, JSON.stringify(this.options).gray);
        return this.options;
    }
};

/*
 * Configurations are all options that the user loads from the options.js file or other.
 */
Patata.prototype.setConfig = function(config) {
    this.config = config;
};

/*
 * Getter for Environment
 */
Patata.prototype.getEnv = function () {
    var env = this.config[this.getOptions().ENV];
    return env;
};
/*
 * Getter for Application
 */
Patata.prototype.getApp = function () {
    var env = this.getEnv();
    var app = env.apps[this.getOptions().APP];
    return app;
};
/*
 * Getter for Flavour
 */
Patata.prototype.getFlavour = function () {
    var app = this.getApp();
    var fla = app.flavours[this.getOptions().FLAVOUR];
    return fla;
};

/*
 * Load plugins
 */
dependencies.extensions(Patata, patata)();

/*
 * Helper to start
 */
Patata.prototype.start = function(hook, scenario, options, implicitWait) {
    return this.init(options)
            .emulator()
            .attachClient(hook)
            .logger()
            .capabilities()
            .reports(scenario)
            .provider(implicitWait || 3 * 1000);
}

/**
 * Export singleton
 */
module.exports = patata;