"use strict";
/* global process */

/**
 * Configuration
 */
function Config() {
}

Config.prototype.config = {
    android: {
        apps: {
            'betsson': {
                capabilities: 'android19',
                flavours: {
                    'live': {
                        useProvider: false, // This will use HockeyApp if true
                        provider: {
                            id: 'hockeyapp',
                            app: 'Betsson'
                        },
                        binary: process.cwd() + '/apps/test.apk'
                    },
                    'qa': {
                        useProvider: true, // This will use HockeyApp if true
                        provider: {
                            id: 'hockeyapp',
                            app: 'Betsson QA'
                        },
                        binary: process.cwd() + '/apps/test-qa.apk'
                    }
                }
            }
        }
    }
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
}

Config.prototype.getEnv = function (options) {
    var env = this.config[options.ENV];
    return env;
};
Config.prototype.getApp = function (options) {
    var env = this.getEnv(options);
    var app = env.apps[options.APP];
    return app;
};
Config.prototype.getFlavour = function (options) {
    var app = this.getApp(options);
    var fla = app.flavours[options.FLAVOUR];
    return fla;
};
Config.prototype.getCapabilities = function (options) {
    var app = this.getApp(options);
    var cap = app.capabilities;
    return cap;
};
Config.prototype.getBinary = function (options) {
    var Q = require('q');
    var deferred = Q.defer();

    var fla = this.getFlavour(options);
    if (!fla.useProvider) {
        deferred.resolve(fla.binary);
    } else {
        require('../providers/' + fla.provider.id)(fla.provider, deferred);
    }
    return deferred.promise;
};

var config = new Config();

/**
 * Export singleton
 */
module.exports.config = config.config;
module.exports.getOptions = config.getOptions;
module.exports.getEnv = config.getEnv;
module.exports.getApp = config.getApp;
module.exports.getFlavour = config.getFlavour;
module.exports.getCapabilities = config.getCapabilities;
module.exports.getBinary = config.getBinary;