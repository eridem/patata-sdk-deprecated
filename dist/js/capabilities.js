"use strict";
var ios81 = (function () {
    function ios81() {
        this.browserName = "Safari";
        this.platformName = "iOS";
        this.platformVersion = "8.1";
        this.deviceName = "iPhone Simulator";
        this.app = "";
    }
    return ios81;
}());
var ios92 = (function () {
    function ios92() {
        this.browserName = "Safari";
        this.platformName = "iOS";
        this.platformVersion = "9.2";
        this.deviceName = "iPhone Simulator";
        this.app = "";
    }
    return ios92;
}());
var android18 = (function () {
    function android18() {
        this.browserName = "Chrome";
        this.platformName = "Android";
        this.platformVersion = "4.3";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android18;
}());
var android19 = (function () {
    function android19() {
        this.browserName = "Chrome";
        this.platformName = "Android";
        this.platformVersion = "4.4.2";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android19;
}());
var android20 = (function () {
    function android20() {
        this.browserName = "Chrome";
        this.platformName = "Android";
        this.platformVersion = "4.4W.2";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android20;
}());
var android21 = (function () {
    function android21() {
        this.browserName = "Chrome";
        this.platformName = "Android";
        this.platformVersion = "5.0.1";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android21;
}());
var android22 = (function () {
    function android22() {
        this.browserName = "Chrome";
        this.platformName = "Android";
        this.platformVersion = "5.1.1";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android22;
}());
var android23 = (function () {
    function android23() {
        this.browserName = "Chrome";
        this.platformName = "Android";
        this.platformVersion = "6.0";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android23;
}());
var CapabilityFactory = (function () {
    function CapabilityFactory() {
        this._capabilities = {
            ios81: new ios81(),
            ios92: new ios92(),
            android18: new android18(),
            android19: new android19(),
            android20: new android20(),
            android21: new android21(),
            android22: new android22(),
            android23: new android23()
        };
        this.setCapabilitiesFriendlyNames();
    }
    CapabilityFactory.prototype.getByName = function (name) {
        if (typeof name === 'string') {
            var capability = this._capabilities[name];
        }
        else if (capability) {
            capability = name;
        }
        else {
            throw new Error("Capability not found.");
        }
        return capability;
    };
    /**
     * This set capabilities names like: ios-8.1, android-5.1.1, ...
     */
    CapabilityFactory.prototype.setCapabilitiesFriendlyNames = function () {
        var capabilitiesWithFriendlyNames = {};
        for (var capName in this._capabilities) {
            var capability = this._capabilities[capName];
            capabilitiesWithFriendlyNames[capName] = capability;
            capabilitiesWithFriendlyNames[(capability.platformName + "-" + capability.platformVersion).toLocaleLowerCase()];
        }
        this._capabilities = capabilitiesWithFriendlyNames;
    };
    return CapabilityFactory;
}());
exports.CapabilityFactory = CapabilityFactory;
