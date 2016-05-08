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
    
    init(configuration: ISuiteConfiguration|string): IPatata;
    suite(name: string, suite: ISuiteConfiguration): IPatata;
    getSuite(suiteConfigurationArg: ISuiteConfiguration|string): ISuiteConfiguration;
    component(name: string, fn: any): IPatata;
    components(components: Array<any>): IPatata;
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
    servers: Array<IServer>;
    config: any;
}

export interface IProvider {
    getBin():Q.IPromise<string>;
}

export interface IReport {
    
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
    start(uri: string):Q.IPromise<IEmulator>;
    quit():IEmulator;
    driver:any;
}

export interface ILoaderHelper {
    loadAsFunctionModuleOrObject(what: Object | string | (() => any)): any;
    obtainPlugin(what: Object | string): any;
}