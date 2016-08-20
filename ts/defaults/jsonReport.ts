import * as Models from '../patata.d';
import * as colors from 'colors';
import * as fs from 'fs';
/// <reference path="../typings/es6-promise/es6-promise.d.ts" />

export class JsonReport implements Models.IReport {
    private _result: any = { features: [] };
    private _currentFeature: any;
    private _currentScenario: any;
    private _currentStep: any;

    private _path: string;

    public get path(): string { return this._path; }

    public constructor(opts: any) {
        this.validateOptions(opts);

        this._path = opts.path;
    }

    private validateOptions(opts: any) {
        if (!opts.path) {
            throw new Error('[Patata][JsonReport] You need to specify the option "path" with the output file path');
        }
    }

    public fromEmulator(action: any, meth: any, path: any, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                var placeToSave = this._currentStep || this._currentScenario || this._currentFeature;
                placeToSave.emulatorSteps = placeToSave.emulatorSteps || [];
                placeToSave.emulatorSteps.push({ action: action, meth: meth, path: path, data: data });
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }

    public beforeFeature(event: Models.IFeature): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._result.features.push(event);
                this._currentFeature = event;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }
    public afterFeature(event: Models.IFeature): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentFeature = null;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }
    public featuresResult(event: Models.IFeaturesResult): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._result.result = event;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }

    public beforeScenario(event: Models.IScenario): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentFeature.scenarios = this._currentFeature.scenarios || [];
                this._currentFeature.scenarios.push(event);
                this._currentScenario = event;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }
    public afterScenario(event: Models.IScenario): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentScenario = null;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }
    public scenarioResult(event: Models.IScenarioResult): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentScenario.result = event;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }

    public beforeStep(event: Models.IStep): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentScenario.steps = this._currentScenario.steps || [];
                this._currentScenario.steps.push(event);
                this._currentStep = event;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }
    public afterStep(event: Models.IStep): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentStep = null;
                resolve();
            } catch (ex) {
                reject(ex)
            }
        })
    }

    public stepResult(event: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this._currentStep.result = event;
                let resultAsString = JSON.stringify(this._result);
                fs.writeFile(this.path, resultAsString, resolve);
            } catch (ex) {
                reject(ex)
            }
        })
    }
}