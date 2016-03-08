"use strict";

module.exports = function(Config) {
    if (!Config) return;
       
    Config.prototype.logger = function() {
        // WebDriver: Logging
        var loggers = this.config.loggers || [];
        for (var i = 0; i < loggers.length; i++) {
            var loggerId = loggers[i];
            require("../loggers/" + loggerId)(this.driver); 
        }
        return this; 
    }
}