import * as Models from './patata.d';
import * as Emulation from './emulation/webDriver';
import * as Q from 'q';

export class Patata implements Models.IPatata {
    _configuration: Models.IConfiguration;
    _reports: Array<Models.IReport>;
    _provider: Models.IProvider;
    _loggers: Array<Models.ILogger>;
    _emulator: Models.IEmulator;
    
    constructor(configuration: Models.IConfiguration) {
        this._configuration = configuration;
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        
        this._emulator = new Emulation.WebDriver(this._configuration);
    }

    public start(hook, scenario, options, implicitWait): Q.IPromise<Models.IPatata> {
        var deferred = Q.defer();
        
        this.attachPatataIntoCucumber(hook);
        
        if (this._provider == null) {
            throw "You need to attach a provider in order to obtain the file to test.";
        }
        
        this._provider.getBin().then((uri) => {
            this._emulator.start(uri).then(() => { deferred.resolve(this); });
        });
        
        return deferred.promise;   
    }
    
    public component(name: symbol, fn: any): Models.IPatata {
        if (fn.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: fn });
        } else {
            this.component(name, () => fn);
        }
        return this;
    }
    
    public components(components: Array<any>): Models.IPatata {
        components.forEach(c => () => this.component(c.name, c.fn));
        return this;
    }
    
    public registerReport(report: string | Models.IReport): Models.IPatata {
        this.registerCollection(this._reports, report);
        return this;
    }
    
    public registerLogger(logger: string | Models.ILogger): Models.IPatata {
        this.registerCollection(this._loggers, logger);
        return this;
    }
    
    public registerProvider(provider: string | Models.IProvider): Models.IPatata {
        this.register(this._provider, provider);
        return this;
    }
    
    private registerCollection(where: Array<any>, what: any): Models.IPatata {   
        if (!where) return this;
                
        if (typeof what === 'string') {
            what = require(what);
        }
        where.push(what);
        return this;
    }
    
    private register(where: any, what: any): Models.IPatata {   
        if (!where) return this;
                
        if (typeof what === 'string') {
            what = require(what);
        }
        where = what;
        return this;
    }
    
    private get emulator(): Models.IEmulator {
        return this._emulator;
    }
    
    private attachPatataIntoCucumber(hook: any) {
        if (hook) {
            hook.patata = this._emulator;
        }
        return this;
    }
}