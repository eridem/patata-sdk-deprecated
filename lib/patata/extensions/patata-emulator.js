"use strict";

module.exports = function(Patata) {
    if (!Patata) return;
        
    Patata.prototype.emulator = function() {
        // WebDriver: Emulator settings
        var options = this.getOptions();
        var serverConfig = this.config.servers[options.SERVER];
        this.driver = require("wd").promiseChainRemote(serverConfig);
        
        this.driver.then = function(text) {
            console.log(text);
            return this;    
        }
        
        return this;    
    }
    
    Patata.prototype.quit = function() {
        this.driver
            .close()
            .quit();
        return this.driver;
    };
    
    Patata.prototype.attachClient = function(obj) {
        if (obj) {
            obj.patata = this.driver;
        }
        return this;
    };
}