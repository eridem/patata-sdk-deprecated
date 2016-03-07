"use strict";
/* global process */

/**
 * Needed references
 */
require('./wd-dependencies');

function Config() {}

require('./config-emulator')(Config);
require('./config-logging')(Config);
require('./config-capabilities')(Config);
require('./config-providers')(Config);

Config.prototype.setConfig = function(config) {
    this.config = config;
};

Config.prototype.init = function(config) {
    this.setConfig(config);
    return this;
};

Config.prototype.quit = function() {
    this.driver
        .close()
        .quit();
    return this.driver;
};

Config.prototype.attachClient = function(obj) {
    if (obj) {
        obj.client = this.driver;
    }
    return this;
};

Config.prototype.getOptions = function () {
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

Config.prototype.getEnv = function () {
    var env = this.config[this.getOptions().ENV];
    return env;
};
Config.prototype.getApp = function () {
    var env = this.getEnv();
    var app = env.apps[this.getOptions().APP];
    return app;
};
Config.prototype.getFlavour = function () {
    var app = this.getApp();
    var fla = app.flavours[this.getOptions().FLAVOUR];
    return fla;
};
Config.prototype.getBinary = function () {
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

var config = new Config();

/**
 * Export singleton
 */
module.exports = config;