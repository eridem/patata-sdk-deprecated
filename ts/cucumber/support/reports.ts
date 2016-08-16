import * as Models from '../../patata.d';
const path = require('path')

let reporter = function () {

    let reportHelper = require(path.join(__dirname, '../../index')).reportHelper;
    let reports = require(path.join(__dirname, '../../index')).reports;

    this.chainReportPromises = function (reports, event, fnString, callback) {
        reports = reports || []

        // First dummy chain
        var promise = new Promise((resolve) => { resolve() });

        // Chain promises to execute one by one synchronously
        reports.forEach((report) => {
            if (typeof report[fnString] !== 'function') {
                return;
            }

            promise = promise.then(() => {
                return report[fnString](event) || new Promise((resolve) => { resolve() });
            })
        });

        return promise.then(callback)
    }

    this.registerHandler('BeforeFeature', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toFeature(event), 'beforeFeature', callback);
    });

    this.registerHandler('AfterFeature', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toFeature(event), 'afterFeature', callback);
    });

    this.registerHandler('FeaturesResult', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toFeaturesResult(event), 'featuresResult', callback);
    });

    this.registerHandler('BeforeScenario', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toScenario(event), 'beforeScenario', callback);
    });

    this.registerHandler('AfterScenario', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toScenario(event), 'afterScenario', callback);
    });

    this.registerHandler('ScenarioResult', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toScenarioResult(event), 'scenarioResult', callback);
    });

    this.registerHandler('BeforeStep', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toStep(event), 'beforeStep', callback);
    });

    this.registerHandler('AfterStep', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toStep(event), 'afterStep', callback);
    });

    this.registerHandler('StepResult', function (event, callback) {
        return this.chainReportPromises(reports, reportHelper.toStepResult(event), 'stepResult', callback);
    });
}

export = reporter;