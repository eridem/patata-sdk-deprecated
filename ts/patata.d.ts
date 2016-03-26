import * as Q from 'q';

export interface IPatata {
    component(name: symbol, fn: any): IPatata;
    components(components: Array<any>): IPatata;
    registerReport(report: string | IReport): IPatata;
    registerLogger(report: string | ILogger): IPatata;
    registerProvider(report: string | IProvider): IPatata;
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
}