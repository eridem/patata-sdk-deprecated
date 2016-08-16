"use strict";
var reporter = function () {
    var reportHelper = require('../../index').reportHelper;
    var reports = require('../../index').reports;
    this.chainReportPromises = function (reports, event, fnString, callback) {
        if (!reports || !reports.lengt) {
            callback();
            return;
        }
        var mainPromise = reports[0][fnString](event);
        for (var i = 1; i < reports.length; i++) {
            if (!reports[i][fnString]) {
                continue;
            }
            mainPromise = mainPromise.then(function () {
                reports[i][fnString](event);
            });
        }
        mainPromise.then(callback);
    };
    this.registerHandler('BeforeFeature', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toFeature(event), 'beforeFeature', callback);
    });
    this.registerHandler('AfterFeature', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toFeature(event), 'afterFeature', callback);
    });
    this.registerHandler('FeaturesResult', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toFeaturesResult(event), 'featuresResult', callback);
    });
    this.registerHandler('BeforeScenario', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toScenario(event), 'beforeScenario', callback);
    });
    this.registerHandler('AfterScenario', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toScenario(event), 'afterScenario', callback);
    });
    this.registerHandler('ScenarioResult', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toScenarioResult(event), 'scenarioResult', callback);
    });
    this.registerHandler('BeforeStep', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toStep(event), 'beforeStep', callback);
    });
    this.registerHandler('AfterStep', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toStep(event), 'afterStep', callback);
    });
    this.registerHandler('StepResult', function (event, callback) {
        this.chainReportPromises(reports, reportHelper.toStepResult(event), 'stepResult', callback);
    });
};
module.exports = reporter;
