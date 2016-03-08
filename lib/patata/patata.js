"use strict";
/* global process */

/**
 * Needed references
 */
var dependencies = require('./dependencies');
require('../utils/actions');

function Patata() {}
var extensions = dependencies.extensions(Patata);

extensions(
    'emulator', 
    'logging', 
    'capabilities',
    'providers',
    'reports',
    'actions');

Patata.prototype.setConfig = function(config) {
    this.config = config;
};

Patata.prototype.init = function(config) {
    this.setConfig(config);
    return this;
};

Patata.prototype.quit = function() {
    this.driver
        .close()
        .quit();
    return this.driver;
};

Patata.prototype.attachClient = function(obj) {
    if (obj) {
        obj.client = this.driver;
    }
    return this;
};

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

Patata.prototype.getEnv = function () {
    var env = this.config[this.getOptions().ENV];
    return env;
};
Patata.prototype.getApp = function () {
    var env = this.getEnv();
    var app = env.apps[this.getOptions().APP];
    return app;
};
Patata.prototype.getFlavour = function () {
    var app = this.getApp();
    var fla = app.flavours[this.getOptions().FLAVOUR];
    return fla;
};
Patata.prototype.getBinary = function () {
    var Q = require('q');
    var deferred = Q.defer();

    var fla = this.getFlavour();
    if (!fla.useProvider) {
        deferred.resolve(fla.binary);
    } else {
        require('../providers/' + fla.provider.id)(this, fla.provider, deferred);
    }
    return deferred.promise;
};
Patata.prototype.start = function(hook, scenario, options, implicitWait) {
    return this.init(options)
            .emulator()
            .attachClient(hook)
            .logger()
            .capabilities()
            .reports(scenario)
            .provider(implicitWait || 3 * 1000);
}

var patata = new Patata();

/**
 * Export singleton
 */
module.exports = patata;