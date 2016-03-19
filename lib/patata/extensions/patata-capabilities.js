"use strict";

module.exports = function(Patata) {
    if (!Patata) return;
    
    Patata.prototype.getCapabilities = function () {
        var app = this.getApp();
        var cap = app.capabilities;
        return cap;
    };
    
    Patata.prototype.capabilities = function() {
        // WebDriver: API config
        this.desired = this.config.capabilities[this.getApp().capabilities];
        return this;
    }
}