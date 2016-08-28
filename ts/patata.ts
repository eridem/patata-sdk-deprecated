"use strict";
declare var require: any;

import * as Models from './patata.d';
import * as Emulation from './emulation/webDriver';
import * as Capabilities from './capabilities';
import * as LoaderHelpers from './loaderHelper';
import * as ReportHelper from './reportHelper';
import * as ReportFactory from './defaults/defaultReportFactory';
import * as FileUtils from './fileUtils';
import * as Log from './log';

require('./dependencies');

export class Patata implements Models.IPatata {
    _suites: Array<Models.ISuiteConfiguration>;
    _currentSuite: Models.ISuiteConfiguration;
    _capabilityFactory: Models.ICapabilityFactory;
    _loaderHelper: Models.ILoaderHelper;
    _reportHelper: Models.IReportHelper;
    _reportFactory: Models.IReportFactory;

    _capability: Models.ICapability;
    _servers: Array<Models.IServer>;
    _reports: Array<Models.IReport>;
    _provider: Models.IProvider;
    _loggers: Array<Models.ILogger>;
    _emulator: Models.IEmulator;
    _config: any;

    _fileUtils: Models.IFileUtils;
    _log: Models.ILog;

    _hasStarted: boolean = false;

    public get suites(): Array<Models.ISuiteConfiguration> { return this._suites; }
    public get currentSuite(): Models.ISuiteConfiguration { return this._currentSuite; }

    private get loaderHelper(): Models.ILoaderHelper {
        if (!this._loaderHelper) {
            this._loaderHelper = new LoaderHelpers.LoaderHelper();
        }
        return this._loaderHelper;
    }

    public get capabilityFactory(): Models.ICapabilityFactory {
        if (!this._capabilityFactory) {
            this._capabilityFactory = new Capabilities.CapabilityFactory();
        }
        return this._capabilityFactory;
    }

    private get reportFactory(): Models.IReportFactory {
        if (!this._reportFactory) {
            this._reportFactory = new ReportFactory.DefaultReportFactory();
        }
        return this._reportFactory;
    }

    public get capability(): Models.ICapability { return this._capability; }
    public get servers(): Array<Models.IServer> { return this._servers; }
    public get reports(): Array<Models.IReport> { return this._reports; }
    public get provider(): Models.IProvider { return this._provider; }
    public get loggers(): Array<Models.ILogger> { return this._loggers; }
    public get emulator(): Models.IEmulator { return this._emulator; }
    public get config(): Models.IEmulator { return this._config || {}; }

    public get fileUtils(): Models.IFileUtils {
        if (!this._fileUtils) {
            this._fileUtils = new FileUtils.FileUtils();
        }
        return this._fileUtils;
    }

    public get log(): Models.ILog {
        if (!this._log) {
            this._log = new Log.Log();
        }
        return this._log;
    }

    constructor() {
        this._suites = new Array();
        this._servers = new Array();
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._emulator = null;
    }

    public get reportHelper(): Models.IReportHelper {
        if (!this._reportHelper) {
            this._reportHelper = new ReportHelper.ReportHelper();
        }
        return this._reportHelper;
    }

    public init(suiteConfigurationArg: Models.ISuiteConfiguration | string): Models.IPatata {
        this._currentSuite = this.getSuite(suiteConfigurationArg);
        this._capability = this.obtainCapability(this.currentSuite);
        this._provider = this.obtainProvider(this.currentSuite);
        this._servers = this.obtainServers(this.currentSuite);
        this._emulator = new Emulation.WebDriver(this);
        this._config = this.obtainConfig(this.currentSuite);
        this._reports = this.obtainReports(this.currentSuite);

        return this;
    }

    public getSuite(suiteConfigurationArg: Models.ISuiteConfiguration | string): Models.ISuiteConfiguration {
        var suiteConfiguration: Models.ISuiteConfiguration;

        if (typeof suiteConfigurationArg === 'string') {
            suiteConfiguration = this._suites[suiteConfigurationArg];
        } else {
            suiteConfiguration = suiteConfigurationArg;
        }

        return suiteConfiguration;
    }

    public start(hook, scenario, implicitWait): Promise<Models.IPatata> {
        return new Promise<Models.IPatata>((resolve, reject) => {
            this.attachPatataIntoCucumber(hook);

            if (this._hasStarted) {
                resolve(this);
                return;
            }

            if (this._provider === null) {
                throw this._log.getError("You need to attach a provider in order to obtain the file to test.");
            }

            this._provider.getBin().then((uri) => {
                this.emulator.start(uri).then(() => {
                    console.log(this.log.getMessage('Using binary: ' + uri))
                    resolve(this);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });

            this._hasStarted = true;
        })
    }

    public quit() {
        this.emulator.quit();
        return this;
    }

    public component(name: string, fn: any): Models.IPatata {
        if (!name || !fn) return this;

        if (fn.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: fn });
        } else {
            this.component(name, () => fn);
        }
        return this;
    }

    public components(components: Array<any>): Models.IPatata {
        for (var attr in components) {
            this.component(attr, components[attr]);
        }
        return this;
    }

    public suite(name: string, suite: Models.ISuiteConfiguration | string | (() => Models.ISuiteConfiguration)): Models.IPatata {
        this._suites[name] = this.loaderHelper.loadAsFunctionModuleOrObject(suite);
        return this;
    }

    private registerReport(report: string | Models.IReport, options: any): Models.IReport {
        if (!report || report === 'default') {
            report = './defaults/defaultReport.js';
        }

        var Plugin = this.loaderHelper.obtainPlugin(report);
        return <Models.IReport>new Plugin(options);
    }

    private registerLogger(logger: string | Models.ILogger, options: any): Models.IPatata {
        var Plugin = this.loaderHelper.obtainPlugin(logger);
        this._loggers.push(new Plugin(options));

        return this;
    }

    private registerProvider(provider: string, options: any): Models.IProvider {
        if (!provider || provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }

        var Plugin = this.loaderHelper.obtainPlugin(provider);
        return <Models.IProvider>new Plugin(this, options);
    }

    public obtainCapability(suiteConfiguration: Models.ISuiteConfiguration): Models.ICapability {
        var result = this.capabilityFactory.getByName(suiteConfiguration.capability);
        return result;
    }

    private obtainProvider(suiteConfiguration: Models.ISuiteConfiguration): Models.IProvider {
        suiteConfiguration.provider.package = suiteConfiguration.provider.package || 'default';
        return this.registerProvider(suiteConfiguration.provider.package, suiteConfiguration.provider);
    }

    private obtainReports(suiteConfiguration: Models.ISuiteConfiguration): Array<Models.IReport> {
        var result = new Array<Models.IReport>();
        suiteConfiguration.reports = suiteConfiguration.reports || [];

        suiteConfiguration.reports.forEach((report: any) => {
            let defaultReporter = this.reportFactory.get(report);
            if (defaultReporter) {
                report = defaultReporter;
            }
            let toAdd = this.registerReport(report.package, report);
            result.push(toAdd);
        });
        this.emulator.registerReports(result);
        return result;
    }

    private obtainServers(suiteConfiguration: Models.ISuiteConfiguration): Array<Models.IServer> {
        return suiteConfiguration.servers;
    }

    private obtainConfig(suiteConfiguration: Models.ISuiteConfiguration): any {
        var config = suiteConfiguration.config;
        return this.loaderHelper.loadAsFunctionModuleOrObject(config);
    }

    private attachPatataIntoCucumber(hook: any) {
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
    }
}