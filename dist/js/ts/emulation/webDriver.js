"use strict";
var WebDriver = (function () {
    function WebDriver(configuration) {
        this._configuration = configuration;
        this._desired = this._configuration.capability;
        this.buildDriverChain();
        this.setUpServers(this._configuration.servers);
        return this;
    }
    WebDriver.prototype.start = function (binary) {
        this._desired.app = binary;
        // Init driver
        return this._wd
            .init(this._desired);
    };
    WebDriver.prototype.quit = function () {
        this._wd
            .close()
            .quit();
        return this;
    };
    Object.defineProperty(WebDriver.prototype, "driver", {
        get: function () {
            return this._wd;
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
            this._wd = require('wd').promiseChainRemote(serverConfig);
        }
    };
    return WebDriver;
}());
exports.WebDriver = WebDriver;
