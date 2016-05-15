"use strict";
let reporter = function () {
    class CallBackCounter {
        constructor(max, callback) {
            this._max = max;
            this._counter = 0;
            this._callback = callback;
        }
        addCallback() {
            this._counter = this._counter + 1;
            if (this._counter >= this._max) {
                this._callback();
            }
        }
    }
    let reportHelper = require('../../index').reportHelper;
    let reports = require('../../index').reports;
    function getCallBackCounter(callback) {
        return new CallBackCounter(reports.length, callback);
    }
    this.registerHandler('BeforeFeature', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.beforeFeature(reportHelper.toFeature(event), () => { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('AfterFeature', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.afterFeature(reportHelper.toFeature(event), () => { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('BeforeScenario', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.beforeScenario(reportHelper.toScenario(event), () => { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('AfterScenario', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.afterScenario(reportHelper.toScenario(event), () => { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('BeforeStep', function (event, callback) {
        if (!reports) {
            callback();
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.beforeStep(reportHelper.toStep(event), () => { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('AfterStep', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.afterStep(reportHelper.toStep(event), () => { callbackCounter.addCallback(); });
        });
    });
    this.registerHandler('StepResult', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report) => {
            report.stepResult(event, () => { callbackCounter.addCallback(); });
        });
    });
};
module.exports = reporter;
