"use strict";

module.exports = function(Patata) {
    if (!Patata) return;
    
    Patata.prototype.reports = function(scenario) { 
        return this;
    }
}