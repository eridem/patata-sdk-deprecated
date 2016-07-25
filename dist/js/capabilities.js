"use strict";
var ios81 = (function () {
    function ios81() {
        this.platformName = "iOS";
        this.platformVersion = "8.1";
        this.deviceName = "iPhone Simulator";
        this.app = "";
    }
    return ios81;
}());
var android18 = (function () {
    function android18() {
        this.platformName = "Android";
        this.platformVersion = "4.3";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android18;
}());
var android19 = (function () {
    function android19() {
        this.platformName = "Android";
        this.platformVersion = "4.4.2";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android19;
}());
var android20 = (function () {
    function android20() {
        this.platformName = "Android";
        this.platformVersion = "4.4W.2";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android20;
}());
var android21 = (function () {
    function android21() {
        this.platformName = "Android";
        this.platformVersion = "5.0.1";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android21;
}());
var android22 = (function () {
    function android22() {
        this.platformName = "Android";
        this.platformVersion = "5.1.1";
        this.deviceName = "Android Emulator";
        this.app = "";
    }
    return android22;
}());
var android23 = (function () {
    function android23() {
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
            android18: new android18(),
            android19: new android19(),
            android20: new android20(),
            android21: new android21(),
            android22: new android22(),
            android23: new android23(),
        };
    }
    CapabilityFactory.prototype.getByName = function (name) {
        var capability = this._capabilities[name];
        if (!capability) {
            throw new Error("Capability not found.");
        }
        return capability;
    };
    return CapabilityFactory;
}());
exports.CapabilityFactory = CapabilityFactory;
