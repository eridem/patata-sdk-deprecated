
/*import * as Models from '../../patata.d';

let reporter = function() {      
    class CallBackCounter {
        private _max: number;
        private _counter: number;
        private _callback: any;
        
        constructor(max: number, callback: any) {
            this._max = max;
            this._counter = 0;
            this._callback = callback;
        }
        
        public addCallback():void {
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
    
    this.registerHandler('BeforeFeature', function(event, callback) {
        if (!reports) {
            callback();
            return;
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.beforeFeature(reportHelper.toFeature(event), () => { callbackCounter.addCallback() });
        });        
    });

    this.registerHandler('AfterFeature', function(event, callback) {
        if (!reports) {
            callback();
            return;
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.afterFeature(reportHelper.toFeature(event), () => { callbackCounter.addCallback() });
        });        
    });

    this.registerHandler('BeforeScenario', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.beforeScenario(reportHelper.toScenario(event), () => { callbackCounter.addCallback() });
        });        
    });

    this.registerHandler('AfterScenario', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.afterScenario(reportHelper.toScenario(event), () => { callbackCounter.addCallback() });
        });
    });

    this.registerHandler('BeforeStep', function (event, callback) {
        if (!reports) {
            callback();
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.beforeStep(reportHelper.toStep(event), () => { callbackCounter.addCallback() });
        });
    });

    this.registerHandler('AfterStep', function (event, callback) {
        if (!reports) {
            callback();
            return;
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.afterStep(reportHelper.toStep(event), () => { callbackCounter.addCallback() });
        });
    });

    this.registerHandler('StepResult', function (event, callback) {      
        if (!reports) {
            callback();
            return;
        }
        
        let callbackCounter = getCallBackCounter(callback);
        reports.forEach((report: Models.IReport) => {
            report.stepResult(event, () => { callbackCounter.addCallback() });
        });
    });
}

export = reporter;*/