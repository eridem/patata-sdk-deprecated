"use strict";
class ios81 {
    constructor() {
        this.platformName = "iOS";
        this.platformVersion = "8.1";
        this.deviceName = "iPhone Simulator";
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
class CapabilityFactory {
    constructor() {
        this._capabilities = {
            ios81: new ios81(),
            android18: new android18(),
            android19: new android19()
        };
    }
    getByName(name) {
        return this._capabilities[name];
    }
}
exports.CapabilityFactory = CapabilityFactory;
