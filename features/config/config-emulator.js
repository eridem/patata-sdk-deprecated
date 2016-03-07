"use strict";

module.exports = function(Config) {
    if (!Config) return;
        
    Config.prototype.emulator = function() {
        // WebDriver: Emulator settings
        var options = this.getOptions();
        var serverConfig = this.config.servers[options.SERVER];
        this.driver = require("wd").promiseChainRemote(serverConfig);  
        return this;    
    }
}