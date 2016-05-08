import * as Models from './patata.d';

class ios81 implements Models.ICapability {
    public platformName: string       = "iOS";
    public platformVersion: string    = "8.1";
    public deviceName: string         = "iPhone Simulator";
    public app: string                = "";
}

class android18 implements Models.ICapability {
    public platformName: string       = "Android";
    public platformVersion: string    = "4.3";
    public deviceName: string         = "Android Emulator";
    public app: string                = "";
}

class android19 implements Models.ICapability {
    public platformName: string       = "Android";
    public platformVersion: string    = "4.4.2";
    public deviceName: string         = "Android Emulator";
    public app: string                = "";
}

export class CapabilityFactory implements Models.ICapabilityFactory {
    _capabilities = { 
        ios81: new ios81(), 
        android18: new android18(), 
        android19: new android19() 
    };
    
    public getByName(name: string): Models.ICapability {
        return this._capabilities[name];
    }
}