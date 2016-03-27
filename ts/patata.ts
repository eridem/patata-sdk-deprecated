"use strict";
declare var require: any;

import * as Models from './patata.d';
import * as Emulation from './emulation/webDriver';
import * as Q from 'q';
import * as _ from 'underscore';

require('./dependencies');

export class Patata implements Models.IPatata {
    _configuration: Models.IConfiguration;
    _reports: Array<Models.IReport>;
    _provider: Models.IProvider;
    _loggers: Array<Models.ILogger>;
    _emulator: Models.IEmulator;
    
    constructor() {
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();       
    }

    public init(configuration: Models.IConfiguration): Models.IPatata {
        this._configuration = configuration;
        this._emulator = new Emulation.WebDriver(this._configuration);
        return this;
    }

    public start(hook, scenario, options, implicitWait): Q.IPromise<Models.IPatata> {
        var deferred = Q.defer();
        
        this.attachPatataIntoCucumber(hook);
        
        if (this._provider === null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        
        this._provider.getBin().then((uri) => {
            this._emulator.start(uri).then(() => { deferred.resolve(this); });
        });
        
        return deferred.promise;   
    }
    
    public quit() {
        this._emulator.quit();
        return this;
    }
    
    public component(name: string, fn: any): Models.IPatata {
        if (!name || !fn) return this;
        if (this._emulator.driver[name]) return this;        
                
        if (fn.length === 0) {
            Object.defineProperty(this._emulator.driver, name, { get: fn });
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
    
    public registerReport(report: string | Models.IReport, options: any): Models.IPatata {
        var Plugin = this.obtainPlugin(report);        
        this._reports.push(new Plugin(options));
        
        return this;
    }
    
    public registerLogger(logger: string | Models.ILogger, options: any): Models.IPatata {
        var Plugin = this.obtainPlugin(logger);        
        this._loggers.push(new Plugin(options));
        
        return this;
    }
    
    public registerProvider(provider: string | Models.IProvider, options: any): Models.IPatata {
        if (provider === 'default') {
            provider = './defaults/defaultProvider.js';
        }
        
        var Plugin = this.obtainPlugin(provider);
        this._provider = new Plugin(options);
        
        return this;
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
       
    private get emulator(): Models.IEmulator {
        return this._emulator;
    }
    
    private attachPatataIntoCucumber(hook: any) {
        if (hook) {
            hook.emu = this.emulator.driver;
        }
        return this;
    }
}