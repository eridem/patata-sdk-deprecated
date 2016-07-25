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

class android20 implements Models.ICapability {
    public platformName: string       = "Android";
    public platformVersion: string    = "4.4W.2";
    public deviceName: string         = "Android Emulator";
    public app: string                = "";
}

class android21 implements Models.ICapability {
    public platformName: string       = "Android";
    public platformVersion: string    = "5.0.1";
    public deviceName: string         = "Android Emulator";
    public app: string                = "";
}

class android22 implements Models.ICapability {
    public platformName: string       = "Android";
    public platformVersion: string    = "5.1.1";
    public deviceName: string         = "Android Emulator";
    public app: string                = "";
}

class android23 implements Models.ICapability {
    public platformName: string       = "Android";
    public platformVersion: string    = "6.0";
    public deviceName: string         = "Android Emulator";
    public app: string                = "";
}

export class CapabilityFactory implements Models.ICapabilityFactory {
    _capabilities = { 
        ios81: new ios81(), 
        android18: new android18(), 
        android19: new android19(),
        android20: new android20(),
        android21: new android21(),
        android22: new android22(),
        android23: new android23(),
    };
    
    public getByName(name: string): Models.ICapability {
        var capability = this._capabilities[name];
        if (!capability) {
            throw new Error("Capability not found.");
        }
        return capability;
    }
}