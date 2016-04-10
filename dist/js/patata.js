"use strict";
var Emulation = require('./emulation/webDriver');
var Q = require('q');
var Capabilities = require('./capabilities');
require('./dependencies');
var Patata = (function () {
    function Patata() {
        this._suites = new Array();
        this._servers = new Array();
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._emulator = null;
        this._capabilityFactory = new Capabilities.CapabilityFactory();
    }
    Object.defineProperty(Patata.prototype, "capability", {
        get: function () { return this._capability; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "servers", {
        get: function () { return this._servers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "reports", {
        get: function () { return this._reports; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "provider", {
        get: function () { return this._provider; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "loggers", {
        get: function () { return this._loggers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "emulator", {
        get: function () { return this._emulator; },
        enumerable: true,
        configurable: true
    });
    Patata.prototype.init = function (suiteConfigurationArg) {
        var suiteConfiguration;
        if (typeof suiteConfigurationArg === 'string') {
            suiteConfiguration = this._suites[suiteConfigurationArg];
        }
        else {
            suiteConfiguration = suiteConfigurationArg;
        }
        this._capability = this.obtainCapability(suiteConfiguration);
        this._provider = this.obtainProvider(suiteConfiguration);
        this._servers = this.obtainServers(suiteConfiguration);
        this._emulator = new Emulation.WebDriver(this);
        return this;
    };
    Patata.prototype.start = function (hook, scenario, implicitWait) {
        var _this = this;
        var deferred = Q.defer();
        this.attachPatataIntoCucumber(hook);
        if (this._provider === null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        this._provider.getBin().then(function (uri) {
            _this._emulator.start(uri).then(function () {
                deferred.resolve(_this);
            });
        });
        return deferred.promise;
    };
    Patata.prototype.quit = function () {
        this._emulator.quit();
        return this;
    };
    Patata.prototype.component = function (name, fn) {
        if (!name || !fn)
            return this;
        if (this.emulator.driver[name])
            return this;
        if (fn.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: fn });
        }
        else {
            this.component(name, function () { return fn; });
        }
        return this;
    };
    Patata.prototype.components = function (components) {
        for (var attr in components) {
            this.component(attr, components[attr]);
        }
        return this;
    };
    Patata.prototype.suite = function (name, suite) {
        this._suites[name] = suite;
        return this;
    };
    Patata.prototype.registerReport = function (report, options) {
        var Plugin = this.obtainPlugin(report);
        this._reports.push(new Plugin(options));
        return this;
    };
    Patata.prototype.registerLogger = function (logger, options) {
        var Plugin = this.obtainPlugin(logger);
        this._loggers.push(new Plugin(options));
        return this;
    };
    Patata.prototype.registerProvider = function (provider, options) {
        if (!provider || provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }
        var Plugin = this.obtainPlugin(provider);
        return new Plugin(options);
    };
    Patata.prototype.obtainCapability = function (suiteConfiguration) {
        return this._capabilityFactory.getByName(suiteConfiguration.capability);
    };
    Patata.prototype.obtainProvider = function (suiteConfiguration) {
        suiteConfiguration.provider.id = suiteConfiguration.provider.id || 'default';
        return this.registerProvider(suiteConfiguration.provider.id, suiteConfiguration.provider);
    };
    Patata.prototype.obtainServers = function (suiteConfiguration) {
        return suiteConfiguration.servers;
    };
    Patata.prototype.obtainPlugin = function (what) {
        if (typeof what === 'string') {
            var objs = require(what);
            for (var attr in objs) {
                what = objs[attr];
            }
        }
        return what;
    };
    Patata.prototype.attachPatataIntoCucumber = function (hook) {
        if (hook) {
            hook.emu = this.emulator.driver;
        }
        return this;
    };
    return Patata;
}());
exports.Patata = Patata;
