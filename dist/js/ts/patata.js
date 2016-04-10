"use strict";
var Emulation = require('./emulation/webDriver');
var Q = require('q');
require('./dependencies');
var Patata = (function () {
    function Patata() {
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._suites = {};
    }
    Patata.prototype.init = function (configuration) {
        if (typeof configuration === 'string') {
            this._configuration = this._suites[configuration];
        }
        else {
            this._configuration = configuration;
        }
        this._emulator = new Emulation.WebDriver(this._configuration);
        return this;
    };
    Patata.prototype.start = function (hook, scenario, options, implicitWait) {
        var _this = this;
        var deferred = Q.defer();
        this.attachPatataIntoCucumber(hook);
        if (this._provider === null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        this._provider.getBin().then(function (uri) {
            _this._emulator.start(uri).then(function () { deferred.resolve(_this); });
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
        if (provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }
        var Plugin = this.obtainPlugin(provider);
        this._provider = new Plugin(options);
        return this;
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
    Object.defineProperty(Patata.prototype, "emulator", {
        get: function () {
            return this._emulator;
        },
        enumerable: true,
        configurable: true
    });
    Patata.prototype.attachPatataIntoCucumber = function (hook) {
        if (hook) {
            hook.emu = this.emulator.driver;
        }
        return this;
    };
    return Patata;
}());
exports.Patata = Patata;
