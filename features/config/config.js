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


Config.prototype.getEnv = function(envArg) {
    var env = this.config[envArg];
    return env;
};
Config.prototype.getApp = function(envArg, appArg) {
    var env = this.getEnv(envArg);
    var app = env.apps[appArg];
    return app;
};
Config.prototype.getFlavour = function(envArg, appArg, flavour) {
    var app = this.getApp(envArg, appArg);
    var fla = app.flavours[flavour];
    return fla;
};
Config.prototype.getCapabilities = function(envArg, appArg) {
    var app = this.getApp(envArg, appArg);
    var cap = app.capabilities;
    return cap;
};
Config.prototype.getBinary = function(envArg, appArg, flavour) {
    var Q = require('q');
    var deferred = Q.defer();
    
    var fla = this.getFlavour(envArg, appArg, flavour);
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
module.exports.getEnv = config.getEnv;
module.exports.getApp = config.getApp;
module.exports.getFlavour = config.getFlavour;
module.exports.getCapabilities = config.getCapabilities;
module.exports.getBinary = config.getBinary;