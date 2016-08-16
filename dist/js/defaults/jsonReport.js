"use strict";
var fs = require('fs');
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />
var JsonReport = (function () {
    function JsonReport(opts) {
        this._result = { features: [] };
        this.validateOptions(opts);
        this._path = opts.path;
    }
    Object.defineProperty(JsonReport.prototype, "path", {
        get: function () { return this._path; },
        enumerable: true,
        configurable: true
    });
    JsonReport.prototype.validateOptions = function (opts) {
        if (!opts.path) {
            throw new Error('[Patata][JsonReport] You need to specify the option "path" with the output file path');
        }
    };
    JsonReport.prototype.fromEmulator = function (action, meth, path, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var placeToSave = _this._currentStep || _this._currentScenario || _this._currentFeature;
                placeToSave.emulatorSteps = placeToSave.emulatorSteps || [];
                placeToSave.emulatorSteps.push({ action: action, meth: meth, path: path, data: data });
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.beforeFeature = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._result.features.push(event);
                _this._currentFeature = event;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.afterFeature = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentFeature = null;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.featuresResult = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentFeature.result = event;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.beforeScenario = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentFeature.scenarios = _this._currentFeature.scenarios || [];
                _this._currentFeature.scenarios.push(event);
                _this._currentScenario = event;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.afterScenario = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentScenario = null;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.scenarioResult = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentScenario.result = event;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.beforeStep = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentScenario.steps = _this._currentScenario.steps || [];
                _this._currentScenario.steps.push(event);
                _this._currentStep = event;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.afterStep = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentStep = null;
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    JsonReport.prototype.stepResult = function (event) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this._currentStep.result = event;
                var resultAsString = JSON.stringify(_this._result);
                fs.writeFile(_this.path, resultAsString, resolve);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    return JsonReport;
}());
exports.JsonReport = JsonReport;
