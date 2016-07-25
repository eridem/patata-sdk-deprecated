/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />

export interface IPatata {
    currentSuite: ISuiteConfiguration;
    capability: ICapability;
    servers: Array<IServer>;
    reports: Array<IReport>;
    provider: IProvider;
    loggers: Array<ILogger>;
    emulator: IEmulator;    
    config: any;
    fileUtils: IFileUtils;
    log: ILog;

    init(configuration: ISuiteConfiguration|string): IPatata;
    suite(name: string, suite: ISuiteConfiguration): IPatata;
    getSuite(suiteConfigurationArg: ISuiteConfiguration|string): ISuiteConfiguration;
    component(name: string, fn: any): IPatata;
    components(components: Array<any>): IPatata;
}

export interface IFileUtils {
    generateResultsFilePath(extension: string);
}

export interface ILog {
    getErrorMessage(message:string):string;
    getError(message:string):Error;
}

export interface IFlavour {
    type: string;
    provider: IProvider;
}

export interface IApp {
    capabilities: ICapability;
    flavour: Array<IFlavour>;
}

export interface ISuiteConfigurationFeatures {
    files: Array<string>;
    tags: Array<string>;
    scenarios: Array<string>;
}

export interface ISuiteConfiguration {
    capability: string;
    components: Array<string>;
    include: Array<string>;
    features: ISuiteConfigurationFeatures;
    provider: ISuiteProvider;
    reports: Array<any>;
    servers: Array<IServer>;
    config: any;
}

export interface IProvider {
    getBin():Q.IPromise<string>;
}

export interface IReport {
    fromEmulator(action: string, meth: string, path: string, data: string): void;
    
    beforeFeature(feature: IFeature, callback: any): void;
    afterFeature(feature: IFeature, callback: any): void;
    
    beforeScenario(scenario: IScenario, callback: any): void;
    afterScenario(scenario: IScenario, callback: any): void;
    
    beforeStep(step: IStep, callback: any): void;
    afterStep(step: IStep, callback: any): void;
    
    stepResult(event: any, callback: any): void;
}

export interface ILogger {
    
}

export interface ISuiteProvider {
    package: string
}

export interface ICapability {
    platformName: string;
    platformVersion: string;
    deviceName: string;
    app: string;
}

export interface ICapabilityFactory {
    getByName(name: string): ICapability;
}

export interface IServer {
    host: string;
    port: number;
}

export interface IEmulator {
    registerReports(report: Array<IReport>): IEmulator;
    start(uri: string):Q.IPromise<IEmulator>;
    quit():IEmulator;
    driver:any;
}

export interface ILoaderHelper {
    loadAsFunctionModuleOrObject(what: Object | string | (() => any)): any;
    obtainPlugin(what: Object | string): any;
}

export interface IReportFactory {
    get(name: any): any;
}

export interface IReportHelper {
    toFeature(event:any): IFeature;
    toScenario(event:any): IScenario;
    toStep(event:any): IStep;
}

export interface IFeature {
    description: string;
    keyword: string;
    line: number;
    name: string;
    scenarioKeyword: Array<string>;
    stepKeywordByLines: string;
    tags: Array<string>;
    uri: string;
}

export interface IScenario {
    description: string;
    keyword: string;
    line: number;
    lines: number;
    name: string;
    tags: any;
    uri: string;
}

export interface IStep {
    arguments: any;
    keyword: string;
    line: number;
    lines: number;
    name: string;
    uri: string;
    uris: string;
    isEventStep: boolean;
    isHidden: boolean;
    isOutcomeStep: boolean;
    isPrecededByEventStep: boolean;
    isPrecededByOutcomeStep: boolean;
    isRepeatingEventStep: boolean;
    isRepeatingOutcomeStep: boolean;    
}