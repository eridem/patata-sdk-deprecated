"use strict";

module.exports = function(Config) {
    if (!Config) return;
    
    Config.prototype.getCapabilities = function () {
        var app = this.getApp();
        var cap = app.capabilities;
        return cap;
    };
    
    Config.prototype.capabilities = function() {
        // WebDriver: API config
        this.desired = this.config.capabilities[this.getApp().capabilities];
        return this;
    }
}