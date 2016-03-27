/// <reference path="../typings/tsd.d.ts" />

export interface IPatata {
    init(configuration: IConfiguration): IPatata;
    component(name: string, fn: any): IPatata;
    components(components: Array<any>): IPatata;
    registerReport(report: string | IReport, options: any): IPatata;
    registerLogger(report: string | ILogger, options: any): IPatata;
    registerProvider(report: string | IProvider, options: any): IPatata;
}

export interface IEnvOptions {
    ENV: String;
    APP: String;
    FLAVOUR: String;
    SERVER: String;
}

export interface IFlavour {
    type: String;
    provider: IProvider;
}

export interface IApp {
    capabilities: ICapability;
    flavour: Array<IFlavour>;
}

export interface IConfiguration {
    capability: ICapability;
    provider: IProvider;
    servers: Array<IServer>;
}

export interface IProvider {
    getBin():Q.IPromise<String>;
}

export interface IReport {
    
}

export interface ILogger {
    
}

export interface ICapability {
    browserName: String;
    'appium-version': String;
    platformName: String;
    PlatformVersion: String;
    deviceName: String;
    app: String;
}

export interface IServer {
    host: String;
    port: number;
}

export interface IEmulator {
    start(uri: String):Q.IPromise<IEmulator>;
    quit():IEmulator;
    driver:any;
}