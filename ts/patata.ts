"use strict";
declare var require: any;

import * as Models from './patata.d';
import * as Emulation from './emulation/webDriver';
import * as Q from 'q';
import * as _ from 'underscore';
import * as Capabilities from './capabilities';

require('./dependencies');

export class Patata implements Models.IPatata {
    _suites: Array<Models.ISuiteConfiguration>;
    _currentSuite: Models.ISuiteConfiguration;
    _capabilityFactory: Models.ICapabilityFactory;
    
    _capability: Models.ICapability;
    _servers: Array<Models.IServer>;
    _reports: Array<Models.IReport>;
    _provider: Models.IProvider;
    _loggers: Array<Models.ILogger>;
    _emulator: Models.IEmulator;
    _config: any;
    
    public get currentSuite(): Models.ISuiteConfiguration { return this._currentSuite; }

    public get capability(): Models.ICapability { return this._capability; }
    public get servers(): Array<Models.IServer> { return this._servers; }
    public get reports(): Array<Models.IReport> { return this._reports; }
    public get provider(): Models.IProvider { return this._provider; }
    public get loggers(): Array<Models.ILogger> { return this._loggers; }
    public get emulator(): Models.IEmulator { return this._emulator; }
    public get config(): Models.IEmulator { return this._config; }
    
    constructor() {
        this._suites = new Array();
        this._servers = new Array();
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._emulator = null;
        this._capabilityFactory = new Capabilities.CapabilityFactory();
    }

    public init(suiteConfigurationArg: Models.ISuiteConfiguration|string): Models.IPatata {
        this._currentSuite = this.getSuite(suiteConfigurationArg);        
       
        this._capability = this.obtainCapability(this.currentSuite);
        this._provider = this.obtainProvider(this.currentSuite);
        this._servers = this.obtainServers(this.currentSuite);
        this._emulator = new Emulation.WebDriver(this);
        this._config = this.obtainConfig(this.currentSuite);
        
        return this;
    }

    public getSuite(suiteConfigurationArg: Models.ISuiteConfiguration|string): Models.ISuiteConfiguration {
        var suiteConfiguration: Models.ISuiteConfiguration;
        
        if (typeof suiteConfigurationArg === 'string') {
            suiteConfiguration = this._suites[suiteConfigurationArg];
        } else {
            suiteConfiguration = suiteConfigurationArg;
        }
        
        return suiteConfiguration;
    }

    public start(hook, scenario, implicitWait): Q.IPromise<Models.IPatata> {
        var deferred = Q.defer();
        
        this.attachPatataIntoCucumber(hook);
        
        if (this._provider === null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        
        this._provider.getBin().then((uri) => {
            this._emulator.start(uri).then(() => { 
                deferred.resolve(this); 
            });
        });
        
        return deferred.promise;   
    }
    
    public quit() {
        this._emulator.quit();
        return this;
    }
    
    public component(name: string, fn: any): Models.IPatata {
        if (!name || !fn) return this;
        if (this.emulator.driver[name]) return this;        
                
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
    
    public suite(name: string, suite: Models.ISuiteConfiguration): Models.IPatata {
        this._suites[name] = suite;
        return this;
    }
    
    private registerReport(report: string | Models.IReport, options: any): Models.IPatata {
        var Plugin = this.obtainPlugin(report);        
        this._reports.push(new Plugin(options));
        
        return this;
    }
    
    private registerLogger(logger: string | Models.ILogger, options: any): Models.IPatata {
        var Plugin = this.obtainPlugin(logger);        
        this._loggers.push(new Plugin(options));
        
        return this;
    }
        
    private registerProvider(provider: string, options: any): Models.IProvider {
        if (!provider || provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }
        
        var Plugin = this.obtainPlugin(provider);
        return <Models.IProvider>new Plugin(options);
    }

    private obtainCapability(suiteConfiguration: Models.ISuiteConfiguration): Models.ICapability {
        return this._capabilityFactory.getByName(suiteConfiguration.capability);
    }

    private obtainProvider(suiteConfiguration: Models.ISuiteConfiguration): Models.IProvider {
        suiteConfiguration.provider.package = suiteConfiguration.provider.package || 'default';
        return this.registerProvider(suiteConfiguration.provider.package, suiteConfiguration.provider);   
    }

    private obtainServers(suiteConfiguration: Models.ISuiteConfiguration): Array<Models.IServer> {
        return suiteConfiguration.servers;
    }
    
    private obtainConfig(suiteConfiguration: Models.ISuiteConfiguration): any {
        var config = suiteConfiguration.config;
        
        if (typeof config === 'function') {
            return config();
        } else if (typeof config === 'string') {
            return require(config);
        }
        
        return config;
    }

    private obtainPlugin(what: any): any {
        if (typeof what === 'string') {
            var objs = require(what);
            for (var attr in objs) {
                what = objs[attr];
            }
        }
        return what;
    }

    private attachPatataIntoCucumber(hook: any) {
        if (hook) {
            hook.emu = this.emulator.driver;
            hook.config = this.config;
        }
        Object.defineProperty(Object.prototype, 'config', this.config);

        return this;
    }
}