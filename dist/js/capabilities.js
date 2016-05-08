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
var CapabilityFactory = (function () {
    function CapabilityFactory() {
        this._capabilities = {
            ios81: new ios81(),
            android18: new android18(),
            android19: new android19()
        };
    }
    CapabilityFactory.prototype.getByName = function (name) {
        return this._capabilities[name];
    };
    return CapabilityFactory;
}());
exports.CapabilityFactory = CapabilityFactory;
