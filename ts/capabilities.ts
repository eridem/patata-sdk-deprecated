import * as Models from './patata.d';
const extend = require('util')._extend;

class ios81 implements Models.ICapability {
    public platformName: string = "iOS";
    public platformVersion: string = "8.1";
    public deviceName: string = "iPhone Simulator";
    public app: string = "";
}

class ios92 implements Models.ICapability {
    public platformName: string = "iOS";
    public platformVersion: string = "9.2";
    public deviceName: string = "iPhone Simulator";
    public app: string = "";
}

class android implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

class android18 implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "4.3";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

class android19 implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "4.4.2";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

class android20 implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "4.4W.2";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

class android21 implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "5.0.1";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

class android22 implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "5.1.1";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

class android23 implements Models.ICapability {
    public platformName: string = "Android";
    public platformVersion: string = "6.0";
    public deviceName: string = "Android Emulator";
    public app: string = "";
}

export class CapabilityFactory implements Models.ICapabilityFactory {
    private _capabilities = <any>{
        ios81: new ios81(),
        ios92: new ios92(),
        android: new android(),
        android18: new android18(),
        android19: new android19(),
        android20: new android20(),
        android21: new android21(),
        android22: new android22(),
        android23: new android23()
    };

    public get capabilities(): any {
        return this._capabilities;
    }

    public constructor() {
        this.setCapabilitiesFriendlyNames();
    }

    public getByName(name: string | any): Models.ICapability {
        if (typeof name === 'string') {
            return this.capabilities[name];
        } else if (name) {
            if (name.template && name.append) {
                var template = this.capabilities[name.template];
                var append = name.append;
                return extend(template, append);
            }
            return name;
        } else {
            throw new Error("Capability not found.");
        }
    }

    /**
     * This set capabilities names like: ios-8.1, android-5.1.1, ...
     */
    private setCapabilitiesFriendlyNames(): void {
        var capabilitiesWithFriendlyNames = {};
        for (var capName in this.capabilities) {
            var capability = this.capabilities[capName];

            if (capability.platformVersion) {
                var friendlyName = `${capability.platformName}-${capability.platformVersion}`.toLocaleLowerCase();
                capabilitiesWithFriendlyNames[friendlyName] = capability;
            }

            capabilitiesWithFriendlyNames[capName] = capability;
        }
        this._capabilities = capabilitiesWithFriendlyNames;
    }
}