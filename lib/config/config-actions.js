"use strict";

module.exports = function(Config) {
    if (!Config) return;
             
    Config.prototype.createComponent = function(name, action) {
        Object.defineProperty(Object.prototype, name, { get: function() { return action; } });
        return this;
    }
    
    Config.prototype.createConfigurableComponent = function(name, action) {
        Object.defineProperty(Object.prototype, name, action);
        return this;
    }
}