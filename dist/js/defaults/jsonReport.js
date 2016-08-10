"use strict";
var fs = require('fs');
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
        var placeToSave = this._currentStep || this._currentScenario || this._currentFeature;
        placeToSave.emulatorSteps = placeToSave.emulatorSteps || [];
        placeToSave.emulatorSteps.push({ action: action, meth: meth, path: path, data: data });
    };
    JsonReport.prototype.beforeFeature = function (event, callback) {
        this._result.features.push(event);
        this._currentFeature = event;
        callback();
    };
    JsonReport.prototype.afterFeature = function (event, callback) {
        this._currentFeature = null;
        callback();
    };
    JsonReport.prototype.featuresResult = function (event, callback) {
        this._currentFeature.result = event;
        callback();
    };
    JsonReport.prototype.beforeScenario = function (event, callback) {
        this._currentFeature.scenarios = this._currentFeature.scenarios || [];
        this._currentFeature.scenarios.push(event);
        this._currentScenario = event;
        callback();
    };
    JsonReport.prototype.afterScenario = function (event, callback) {
        this._currentScenario = null;
        callback();
    };
    JsonReport.prototype.scenarioResult = function (event, callback) {
        this._currentScenario.result = event;
        callback();
    };
    JsonReport.prototype.beforeStep = function (event, callback) {
        this._currentScenario.steps = this._currentScenario.steps || [];
        this._currentScenario.steps.push(event);
        this._currentStep = event;
        callback();
    };
    JsonReport.prototype.afterStep = function (event, callback) {
        this._currentStep = null;
        callback();
    };
    JsonReport.prototype.stepResult = function (event, callback) {
        this._currentStep.result = event;
        var resultAsString = JSON.stringify(this._result);
        fs.writeFile(this.path, resultAsString, callback);
    };
    return JsonReport;
}());
exports.JsonReport = JsonReport;
