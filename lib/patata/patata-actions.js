"use strict";

module.exports = function(Config) {
    if (!Config) return;
             
    Config.prototype.component = function(name, action) {
        if (action.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: action });
        } else {
            Config.prototype.component(name, function() { return action; });
        }
        return this;
    }
    
    Config.prototype.components = function(components) {
        for (var name in components) {
            Config.prototype.component(name, components[name]);
        }
        return this;
    }
}