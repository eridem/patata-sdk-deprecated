"use strict";

module.exports = function(Config) {
    if (!Config) return;
             
    Config.prototype.createComponent = function(name, action) {
        Object.defineProperty(Object.prototype, name, { get: action });
        return this;
    }
    
    Config.prototype.createConfigurableComponent = function(name, action) {
        Config.prototype.createComponent(name, function() { return action; });
        return this;
    }
}