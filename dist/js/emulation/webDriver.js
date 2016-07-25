"use strict";
var WebDriver = (function () {
    function WebDriver(patata) {
        this._desired = patata.capability;
        this.buildDriverChain();
        this.setUpServers(patata.servers);
        return this;
    }
    WebDriver.prototype.start = function (binary) {
        this._desired.app = binary;
        // Init driver
        return this.driver
            .init(this._desired)
            .setImplicitWaitTimeout(45 * 1000);
    };
    WebDriver.prototype.quit = function () {
        this.driver
            .close()
            .quit();
        return this;
    };
    Object.defineProperty(WebDriver.prototype, "driver", {
        get: function () {
            return this._driver;
        },
        enumerable: true,
        configurable: true
    });
    WebDriver.prototype.buildDriverChain = function () {
        require("chai-as-promised").transferPromiseness = require('wd').transferPromiseness;
    };
    WebDriver.prototype.setUpServers = function (servers) {
        for (var attr in servers) {
            var serverConfig = servers[attr];
            this._driver = require('wd').promiseChainRemote(serverConfig);
        }
    };
    WebDriver.prototype.registerReports = function (report) {
        this.driver.on('status', function (info) {
            report.forEach(function (report) {
                report.fromEmulator('status', info, '', '');
            });
        });
        this.driver.on('command', function (meth, path, data) {
            report.forEach(function (report) {
                report.fromEmulator('command', meth, path, data || '');
            });
        });
        this.driver.on('http', function (meth, path, data) {
            report.forEach(function (report) {
                report.fromEmulator('http', meth, path, data || '');
            });
        });
        return this;
    };
    return WebDriver;
}());
exports.WebDriver = WebDriver;
