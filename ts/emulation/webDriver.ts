import * as Models from '../patata.d';
declare var require: any;

export class WebDriver implements Models.IEmulator {
    
    private _wd: any;
    private _desired: any;
    private _configuration: Models.IConfiguration;
    
    constructor(configuration: Models.IConfiguration) {
        this._configuration = configuration;
        this._desired = this._configuration.capability;
        return this;
    }
    
    public start(binary: String) : Q.IPromise<Models.IEmulator> {
        for (let attr in this._configuration.servers) {
            var serverConfig = this._configuration.servers[attr];//.getServer.servers[options.SERVER];
            this._wd = require('wd').promiseChainRemote(serverConfig);
        }
        
        this._desired.app = binary;
        
        // Init driver
        return this._wd
            .init(this._desired)
            //.setImplicitWaitTimeout(this.implicitWait)
            ;
    }
    
    public quit() : Models.IEmulator {
        this._wd
            .close()
            .quit();
        return this;
    }
}