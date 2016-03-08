"use strict";

module.exports = function(Config) {
    if (!Config) return;
    
    Config.prototype.reports = function(scenario) { 
        return this;
    }
}