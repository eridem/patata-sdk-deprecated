"use strict";

declare var require: any;
import * as Models from '../patata.d';

export class WebDriver implements Models.IEmulator {

    private _driver: any;
    private _desired: any;
    private _appiumMsgQueue: any[];

    constructor(patata: Models.IPatata) {
        this._desired = patata.capability;

        this.buildDriverChain();
        this.setUpServers(patata.servers);

        return this;
    }

    public start(binary: string): Promise<Models.IEmulator> {
        this._desired.app = binary;

        // Init driver
        return this.driver
            .init(this._desired)
            .setImplicitWaitTimeout(45 * 1000)
            ;
    }

    public quit(): Models.IEmulator {
        this.driver
            .close()
            .quit();
        return this;
    }

    public get driver(): any {
        return this._driver;
    }

    public get appiumMsgQueue(): any[] {
        if (!this._appiumMsgQueue) {
            this._appiumMsgQueue = []
        }
        return this._appiumMsgQueue;
    }

    private buildDriverChain(): void {
        require("chai-as-promised").transferPromiseness = require('wd').transferPromiseness;
    }

    private setUpServers(servers: Array<Models.IServer>): void {
        for (var attr in servers) {
            var serverConfig = servers[attr];
            this._driver = require('wd').promiseChainRemote(serverConfig);
        }
    }

    public registerReports(report: Array<Models.IReport>): Models.IEmulator {
        let that = this
        this.driver.on('status', function (info) {
            that.appiumMsgQueue.push({ status: 'status', info });

            report.forEach(report => {
                if (typeof report.fromEmulator === 'function') {
                    report.fromEmulator('status', info, '', '');
                }
            });
        });
        this.driver.on('command', function (meth, path, data) {
            that.appiumMsgQueue.push({ status: 'command', meth, path, data: data || '' });

            report.forEach(report => {
                if (typeof report.fromEmulator === 'function') {
                    report.fromEmulator('command', meth, path, data || '');
                }
            });
        });
        this.driver.on('http', function (meth, path, data) {
            that.appiumMsgQueue.push({ status: 'http', meth, path, data: data || '' });

            report.forEach(report => {
                if (typeof report.fromEmulator === 'function') {
                    report.fromEmulator('http', meth, path, data || '');
                }
            });
        });
        return this;
    }
}