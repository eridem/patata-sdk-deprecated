import * as Models from '../patata.d';
import * as colors from 'colors';
import * as fs from 'fs';

export class JsonReport implements Models.IReport {
    private _result: any = { features:[] };
    private _currentFeature: any;
    private _currentScenario: any;
    private _currentStep: any;
    
    public fromEmulator(action: any, meth: any, path: any, data: any): void {
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
    
    public beforeFeature(event: Models.IFeature, callback: any): void {
        this._result.features.push(event);
        this._currentFeature = event;
        callback();
    }
    public afterFeature(event: Models.IFeature, callback: any): void {
        this._currentFeature = null;
        callback();
    }
    
    public beforeScenario(event: Models.IScenario, callback: any): void {
        this._currentFeature.scenarios = this._currentFeature.scenarios || [];
        this._currentFeature.scenarios.push(event);
        this._currentScenario = event;
        callback();
    }
    public afterScenario(event: Models.IScenario, callback: any): void {
        this._currentScenario = null;
        callback();
    }
    
    public beforeStep(event: Models.IStep, callback: any): void {
        this._currentScenario.steps = this._currentScenario.steps || [];
        this._currentScenario.steps.push(event);
        this._currentStep = event;
        callback();
    }
    public afterStep(event: Models.IStep, callback: any): void {
        this._currentStep = null;
        callback();
    }
    
    public stepResult(event: any, callback: any): void {
        let resultAsString = JSON.stringify(this._result);
        fs.writeFile("./results.json", resultAsString, callback);
    }
}