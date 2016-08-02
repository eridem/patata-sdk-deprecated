"use strict";
var Emulation = require('./emulation/webDriver');
var Q = require('q');
var Capabilities = require('./capabilities');
var LoaderHelpers = require('./loaderHelper');
var ReportHelper = require('./reportHelper');
var ReportFactory = require('./defaults/defaultReportFactory');
var FileUtils = require('./fileUtils');
var Log = require('./log');
var Cli = require('./cli');
require('./dependencies');
var Patata = (function () {
    function Patata() {
        this._hasStarted = false;
        this._suites = new Array();
        this._servers = new Array();
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._emulator = null;
    }
    Object.defineProperty(Patata.prototype, "currentSuite", {
        get: function () { return this._currentSuite; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "loaderHelper", {
        get: function () {
            if (!this._loaderHelper) {
                this._loaderHelper = new LoaderHelpers.LoaderHelper();
            }
            return this._loaderHelper;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "capabilityFactory", {
        get: function () {
            if (!this._capabilityFactory) {
                this._capabilityFactory = new Capabilities.CapabilityFactory();
            }
            return this._capabilityFactory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "reportFactory", {
        get: function () {
            if (!this._reportFactory) {
                this._reportFactory = new ReportFactory.DefaultReportFactory();
            }
            return this._reportFactory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "cli", {
        get: function () { return Cli.cli; },
        enumerable: true,
        configurable: true
    });
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
    Object.defineProperty(Patata.prototype, "config", {
        get: function () { return this._config || {}; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "fileUtils", {
        get: function () {
            if (!this._fileUtils) {
                this._fileUtils = new FileUtils.FileUtils();
            }
            return this._fileUtils;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "log", {
        get: function () {
            if (!this._log) {
                this._log = new Log.Log();
            }
            return this._log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Patata.prototype, "reportHelper", {
        get: function () {
            if (!this._reportHelper) {
                this._reportHelper = new ReportHelper.ReportHelper();
            }
            return this._reportHelper;
        },
        enumerable: true,
        configurable: true
    });
    Patata.prototype.init = function (suiteConfigurationArg) {
        this._currentSuite = this.getSuite(suiteConfigurationArg);
        this._capability = this.obtainCapability(this.currentSuite);
        this._provider = this.obtainProvider(this.currentSuite);
        this._servers = this.obtainServers(this.currentSuite);
        this._emulator = new Emulation.WebDriver(this);
        this._config = this.obtainConfig(this.currentSuite);
        this._reports = this.obtainReports(this.currentSuite);
        return this;
    };
    Patata.prototype.getSuite = function (suiteConfigurationArg) {
        var suiteConfiguration;
        if (typeof suiteConfigurationArg === 'string') {
            suiteConfiguration = this._suites[suiteConfigurationArg];
        }
        else {
            suiteConfiguration = suiteConfigurationArg;
        }
        return suiteConfiguration;
    };
    Patata.prototype.start = function (hook, scenario, implicitWait) {
        var _this = this;
        var deferred = Q.defer();
        this.attachPatataIntoCucumber(hook);
        if (this._hasStarted) {
            deferred.resolve(this);
            return deferred.promise;
        }
        if (this._provider === null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        this._provider.getBin().then(function (uri) {
            _this.emulator.start(uri).then(function () {
                deferred.resolve(_this);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }).catch(function (error) {
            deferred.reject(error);
        });
        this._hasStarted = true;
        return deferred.promise;
    };
    Patata.prototype.quit = function () {
        this.emulator.quit();
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
        this._suites[name] = this.loaderHelper.loadAsFunctionModuleOrObject(suite);
        return this;
    };
    Patata.prototype.registerReport = function (report, options) {
        if (!report || report === 'default') {
            report = './defaults/defaultReport.js';
        }
        var Plugin = this.loaderHelper.obtainPlugin(report);
        return new Plugin(options);
    };
    Patata.prototype.registerLogger = function (logger, options) {
        var Plugin = this.loaderHelper.obtainPlugin(logger);
        this._loggers.push(new Plugin(options));
        return this;
    };
    Patata.prototype.registerProvider = function (provider, options) {
        if (!provider || provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }
        var Plugin = this.loaderHelper.obtainPlugin(provider);
        return new Plugin(this, options);
    };
    Patata.prototype.obtainCapability = function (suiteConfiguration) {
        var result = this.capabilityFactory.getByName(suiteConfiguration.capability);
        return result;
    };
    Patata.prototype.obtainProvider = function (suiteConfiguration) {
        suiteConfiguration.provider.package = suiteConfiguration.provider.package || 'default';
        return this.registerProvider(suiteConfiguration.provider.package, suiteConfiguration.provider);
    };
    Patata.prototype.obtainReports = function (suiteConfiguration) {
        var _this = this;
        var result = new Array();
        suiteConfiguration.reports = suiteConfiguration.reports || [];
        suiteConfiguration.reports.forEach(function (report) {
            var defaultReporter = _this.reportFactory.get(report);
            if (defaultReporter) {
                report = defaultReporter;
            }
            var toAdd = _this.registerReport(report.package, report);
            result.push(toAdd);
        });
        this.emulator.registerReports(result);
        return result;
    };
    Patata.prototype.obtainServers = function (suiteConfiguration) {
        return suiteConfiguration.servers;
    };
    Patata.prototype.obtainConfig = function (suiteConfiguration) {
        var config = suiteConfiguration.config;
        return this.loaderHelper.loadAsFunctionModuleOrObject(config);
    };
    Patata.prototype.attachPatataIntoCucumber = function (hook) {
        if (hook) {
            Object.defineProperty(hook, 'emu', {
                enumerable: true,
                writable: true,
                value: this.emulator.driver
            });
            Object.defineProperty(hook, 'config', {
                enumerable: true,
                writable: true,
                value: this.config
            });
        }
        Object.defineProperty(Object.prototype, 'config', this.config);
        return this;
    };
    return Patata;
}());
exports.Patata = Patata;
