"use strict";

declare var require: any;
import * as Models from '../patata.d';

export class WebDriver implements Models.IEmulator {
    
    private _wd: any;
    private _desired: any;
    private _configuration: Models.IConfiguration;
       
    constructor(configuration: Models.IConfiguration) {
        this._configuration = configuration;
        this._desired = this._configuration.capability;
        
        this.buildDriverChain();        
        this.setUpServers(this._configuration.servers);
        
        return this;
    }
    
    public start(binary: String) : Q.IPromise<Models.IEmulator> {        
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
    
    public get driver():any {
        return this._wd;
    }
    
    private buildDriverChain():void {
        require("chai-as-promised").transferPromiseness = require('wd').transferPromiseness;
    }
    
    private setUpServers(servers: Array<Models.IServer>): void {
        for (var attr in servers) {
            var serverConfig = servers[attr];
            this._wd = require('wd').promiseChainRemote(serverConfig);
        }  
    }
}