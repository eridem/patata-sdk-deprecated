"use strict";
class WebDriver {
    constructor(patata) {
        this._desired = patata.capability;
        this.buildDriverChain();
        this.setUpServers(patata.servers);
        return this;
    }
    start(binary) {
        this._desired.app = binary;
        // Init driver
        return this.driver
            .init(this._desired)
            .setImplicitWaitTimeout(45 * 1000);
    }
    quit() {
        this.driver
            .close()
            .quit();
        return this;
    }
    get driver() {
        return this._driver;
    }
    buildDriverChain() {
        require("chai-as-promised").transferPromiseness = require('wd').transferPromiseness;
    }
    setUpServers(servers) {
        for (var attr in servers) {
            var serverConfig = servers[attr];
            this._driver = require('wd').promiseChainRemote(serverConfig);
        }
    }
    registerReports(report) {
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
exports.WebDriver = WebDriver;
