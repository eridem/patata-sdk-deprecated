"use strict";
const fs = require('fs');
class JsonReport {
    constructor() {
        this._result = { features: [] };
    }
    fromEmulator(action, meth, path, data) {
        /*if (action === 'http') {
            console.log('\t> ' + meth.magenta, path, (data || '').grey);
        } else if (action === 'command') {
            console.log('\t> ' + meth.yellow, path.grey, data || '');
        } else if (action === 'status') {
            console.log('\t> ' + action.cyan, meth.grey);
        }*/
        var placeToSave = this._currentStep || this._currentScenario || this._currentFeature;
        placeToSave.emulatorSteps = placeToSave.emulatorSteps || [];
        placeToSave.emulatorSteps.push({ action: action, meth: meth, path: path, data: data });
    }
    beforeFeature(event, callback) {
        this._result.features.push(event);
        this._currentFeature = event;
        callback();
    }
    afterFeature(event, callback) {
        this._currentFeature = null;
        callback();
    }
    beforeScenario(event, callback) {
        this._currentFeature.scenarios = this._currentFeature.scenarios || [];
        this._currentFeature.scenarios.push(event);
        this._currentScenario = event;
        callback();
    }
    afterScenario(event, callback) {
        this._currentScenario = null;
        callback();
    }
    beforeStep(event, callback) {
        this._currentScenario.steps = this._currentScenario.steps || [];
        this._currentScenario.steps.push(event);
        this._currentStep = event;
        callback();
    }
    afterStep(event, callback) {
        this._currentStep = null;
        callback();
    }
    stepResult(event, callback) {
        let resultAsString = JSON.stringify(this._result);
        fs.writeFile("./results.json", resultAsString, callback);
    }
}
exports.JsonReport = JsonReport;
