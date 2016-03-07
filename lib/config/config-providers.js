"use strict";

module.exports = function(Config) {
    if (!Config) return;
       
    Config.prototype.provider = function(implicitWait) {
        this.implicitWait = implicitWait || 3 * 1000;
        // Provider
        var ProviderFactory = require('../providers/provider-factory');
        var provider = new ProviderFactory(this.driver, this.desired, this.implicitWait);  
        return provider.create(this);
    }
}