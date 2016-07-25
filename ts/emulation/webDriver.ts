"use strict";

declare var require: any;
import * as Models from '../patata.d';

export class WebDriver implements Models.IEmulator {
    
    private _driver: any;
    private _desired: any;
             
    constructor(patata: Models.IPatata) {
        this._desired = patata.capability;
        
        this.buildDriverChain();        
        this.setUpServers(patata.servers);
        
        return this;
    }
    
    public start(binary: string) : Q.IPromise<Models.IEmulator> {        
        this._desired.app = binary;
        
        // Init driver
        return this.driver
            .init(this._desired)
            .setImplicitWaitTimeout(45 * 1000)
            ;
    }
    
    public quit() : Models.IEmulator {
        this.driver
            .close()
            .quit();
        return this;
    }
    
    public get driver():any {
        return this._driver;
    }
    
    private buildDriverChain():void {
        require("chai-as-promised").transferPromiseness = require('wd').transferPromiseness;
    }
    
    private setUpServers(servers: Array<Models.IServer>): void {
        for (var attr in servers) {
            var serverConfig = servers[attr];
            this._driver = require('wd').promiseChainRemote(serverConfig);
        }
    }
    
    public registerReports(report: Array<Models.IReport>): Models.IEmulator {
        this.driver.on('status', function (info) {
            report.forEach(report => {
                report.fromEmulator('status', info, '', '');
            });
        });
        this.driver.on('command', function (meth, path, data) {
            report.forEach(report => {
                report.fromEmulator('command', meth, path, data || '');
            });
        });
        this.driver.on('http', function (meth, path, data) {
            report.forEach(report => {
                report.fromEmulator('http', meth, path, data || '');
            });            
        });
        return this;
    }
}