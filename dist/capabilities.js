"use strict";
const extend = require('util')._extend;
class ios81 {
    constructor() {
        this.platformName = "iOS";
        this.platformVersion = "8.1";
        this.deviceName = "iPhone Simulator";
        this.app = "";
    }
}
class ios92 {
    constructor() {
        this.platformName = "iOS";
        this.platformVersion = "9.2";
        this.deviceName = "iPhone Simulator";
        this.app = "";
    }
}
class android {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class android18 {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "4.3";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class android19 {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "4.4.2";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class android20 {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "4.4W.2";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class android21 {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "5.0.1";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class android22 {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "5.1.1";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class android23 {
    constructor() {
        this.platformName = "Android";
        this.platformVersion = "6.0";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
}
class CapabilityFactory {
    constructor() {
        this._capabilities = {
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
        this.setCapabilitiesFriendlyNames();
    }
    get capabilities() {
        return this._capabilities;
    }
    getByName(name) {
        if (typeof name === 'string') {
            return this.capabilities[name];
        }
        else if (name) {
            if (name.template && name.append) {
                var template = this.capabilities[name.template];
                var append = name.append;
                return extend(template, append);
            }
            return name;
        }
        else {
            throw new Error("Capability not found.");
        }
    }
    /**
     * This set capabilities names like: ios-8.1, android-5.1.1, ...
     */
    setCapabilitiesFriendlyNames() {
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
exports.CapabilityFactory = CapabilityFactory;
