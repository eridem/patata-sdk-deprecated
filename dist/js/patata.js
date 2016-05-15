"use strict";
const Emulation = require('./emulation/webDriver');
const Q = require('q');
const Capabilities = require('./capabilities');
const LoaderHelpers = require('./loaderHelper');
const ReportHelper = require('./reportHelper');
const ReportFactory = require('./defaults/defaultReportFactory');
require('./dependencies');
class Patata {
    constructor() {
        this._suites = new Array();
        this._servers = new Array();
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._emulator = null;
    }
    get currentSuite() { return this._currentSuite; }
    get loaderHelper() {
        if (!this._loaderHelper) {
            this._loaderHelper = new LoaderHelpers.LoaderHelper();
        }
        return this._loaderHelper;
    }
    get capabilityFactory() {
        if (!this._capabilityFactory) {
            this._capabilityFactory = new Capabilities.CapabilityFactory();
        }
        return this._capabilityFactory;
    }
    get reportFactory() {
        if (!this._reportFactory) {
            this._reportFactory = new ReportFactory.DefaultReportFactory();
        }
        return this._reportFactory;
    }
    get capability() { return this._capability; }
    get servers() { return this._servers; }
    get reports() { return this._reports; }
    get provider() { return this._provider; }
    get loggers() { return this._loggers; }
    get emulator() { return this._emulator; }
    get config() { return this._config; }
    get reportHelper() {
        if (!this._reportHelper) {
            this._reportHelper = new ReportHelper.ReportHelper();
        }
        return this._reportHelper;
    }
    init(suiteConfigurationArg) {
        this._currentSuite = this.getSuite(suiteConfigurationArg);
        this._capability = this.obtainCapability(this.currentSuite);
        this._provider = this.obtainProvider(this.currentSuite);
        this._servers = this.obtainServers(this.currentSuite);
        this._emulator = new Emulation.WebDriver(this);
        this._config = this.obtainConfig(this.currentSuite);
        this._reports = this.obtainReports(this.currentSuite);
        return this;
    }
    getSuite(suiteConfigurationArg) {
        var suiteConfiguration;
        if (typeof suiteConfigurationArg === 'string') {
            suiteConfiguration = this._suites[suiteConfigurationArg];
        }
        else {
            suiteConfiguration = suiteConfigurationArg;
        }
        return suiteConfiguration;
    }
    start(hook, scenario, implicitWait) {
        var deferred = Q.defer();
        this.attachPatataIntoCucumber(hook);
        if (this._provider === null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        this._provider.getBin().then((uri) => {
            this.emulator.start(uri).then(() => {
                deferred.resolve(this);
            });
        });
        return deferred.promise;
    }
    quit() {
        this.emulator.quit();
        return this;
    }
    component(name, fn) {
        if (!name || !fn)
            return this;
        if (this.emulator.driver[name])
            return this;
        if (fn.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: fn });
        }
        else {
            this.component(name, () => fn);
        }
        return this;
    }
    components(components) {
        for (var attr in components) {
            this.component(attr, components[attr]);
        }
        return this;
    }
    suite(name, suite) {
        this._suites[name] = this.loaderHelper.loadAsFunctionModuleOrObject(suite);
        return this;
    }
    registerReport(report) {
        if (!report || report === 'default') {
            report = './defaults/defaultReport.js';
        }
        var Plugin = this.loaderHelper.obtainPlugin(report);
        return new Plugin();
    }
    registerLogger(logger, options) {
        var Plugin = this.loaderHelper.obtainPlugin(logger);
        this._loggers.push(new Plugin(options));
        return this;
    }
    registerProvider(provider, options) {
        if (!provider || provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }
        var Plugin = this.loaderHelper.obtainPlugin(provider);
        return new Plugin(options);
    }
    obtainCapability(suiteConfiguration) {
        return this.capabilityFactory.getByName(suiteConfiguration.capability);
    }
    obtainProvider(suiteConfiguration) {
        suiteConfiguration.provider.package = suiteConfiguration.provider.package || 'default';
        return this.registerProvider(suiteConfiguration.provider.package, suiteConfiguration.provider);
    }
    obtainReports(suiteConfiguration) {
        var result = new Array();
        suiteConfiguration.reports = suiteConfiguration.reports || [];
        suiteConfiguration.reports.forEach(report => {
            // If the reporter is registered inside patata, use this module instead
            // Eg. json => ./defaults/jsonReport
            let defaultReporter = this.reportFactory.getByName(report);
            if (defaultReporter) {
                report = defaultReporter;
            }
            let toAdd = this.registerReport(report);
            result.push(toAdd);
        });
        this.emulator.registerReports(result);
        return result;
    }
    obtainServers(suiteConfiguration) {
        return suiteConfiguration.servers;
    }
    obtainConfig(suiteConfiguration) {
        var config = suiteConfiguration.config;
        return this.loaderHelper.loadAsFunctionModuleOrObject(config);
    }
    attachPatataIntoCucumber(hook) {
        if (hook) {
            hook.emu = this.emulator.driver;
            hook.config = this.config;
        }
        Object.defineProperty(Object.prototype, 'config', this.config);
        return this;
    }
}
exports.Patata = Patata;
