import * as Models from '../patata.d';
declare var require: any;

export class WebDriver implements Models.IEmulator {
    
    private _wd: any;
    private _desired: any;
    private _configuration: Models.IConfiguration;
    
    constructor(configuration: Models.IConfiguration) {
        this._configuration = configuration;
    }
    
    public start(binary: String) : Q.IPromise<Models.IEmulator> {
        for (let i; i < this._configuration.servers.length; i++) {
            var serverConfig = this._configuration.servers[i];//.getServer.servers[options.SERVER];
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