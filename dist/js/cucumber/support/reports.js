"use strict";
var reporter = function () {
    var CallBackCounter = (function () {
        function CallBackCounter(max, callback) {
            this._max = max;
            this._counter = 0;
            this._callback = callback;
        }
        CallBackCounter.prototype.addCallback = function () {
            this._counter = this._counter + 1;
            if (this._counter >= this._max) {
                this._callback();
            }
        };
        return CallBackCounter;
    }());
    var reportHelper = require('../../index').reportHelper;
    var reports = require('../../index').reports;
    function getCallBackCounter(callback) {
        return new CallBackCounter(reports.length, callback);
    }
    this.registerHandler('BeforeFeature', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.beforeFeature(reportHelper.toFeature(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('AfterFeature', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.afterFeature(reportHelper.toFeature(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('FeaturesResult', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.featuresResult(reportHelper.toFeaturesResult(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('BeforeScenario', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.beforeScenario(reportHelper.toScenario(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('AfterScenario', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.afterScenario(reportHelper.toScenario(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('ScenarioResult', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.scenarioResult(reportHelper.toScenarioResult(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('BeforeStep', function (event, callback) {
        if (!reports) {
            callback();
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.beforeStep(reportHelper.toStep(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('AfterStep', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.afterStep(reportHelper.toStep(event), function () { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('StepResult', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        var callbackCounter = getCallBackCounter(callback);
        reports.forEach(function (report) {
            report.stepResult(reportHelper.toStepResult(event), function () { callbackCounter.addCallback(); });
        });
    });
};
module.exports = reporter;
