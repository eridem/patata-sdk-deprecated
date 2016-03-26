import * as Emulation from './emulation/webDriver';
import * as Q from 'q';
export class Patata {
    constructor(configuration) {
        this._configuration = configuration;
        this._reports = new Array();
        this._provider = null;
        this._loggers = new Array();
        this._emulator = new Emulation.WebDriver(this._configuration);
    }
    start(hook, scenario, options, implicitWait) {
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
    component(name, fn) {
        if (fn.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: fn });
        }
        else {
            this.component(name, () => fn);
        }
        return this;
    }
    components(components) {
        components.forEach(c => () => this.component(c.name, c.fn));
        return this;
    }
    registerReport(report) {
        this.registerCollection(this._reports, report);
        return this;
    }
    registerLogger(logger) {
        this.registerCollection(this._loggers, logger);
        return this;
    }
    registerProvider(provider) {
        this.register(this._provider, provider);
        return this;
    }
    registerCollection(where, what) {
        if (!where)
            return this;
        if (typeof what === 'string') {
            what = require(what);
        }
        where.push(what);
        return this;
    }
    register(where, what) {
        if (!where)
            return this;
        if (typeof what === 'string') {
            what = require(what);
        }
        where = what;
        return this;
    }
    get emulator() {
        return this._emulator;
    }
    attachPatataIntoCucumber(hook) {
        if (hook) {
            hook.patata = this._emulator;
        }
        return this;
    }
}
