"use strict";

module.exports = function(Patata) {
    if (!Patata) return;
       
    Patata.prototype.logger = function() {
        // WebDriver: Logging
        var loggers = this.config.loggers || [];
        for (var i = 0; i < loggers.length; i++) {
            var loggerId = loggers[i];
            require("../loggers/" + loggerId)(this.driver); 
        }
        return this; 
    }
}