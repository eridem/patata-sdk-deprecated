"use strict";

module.exports = function(Patata, patata) {
    if (!Patata) return;
             
    Patata.prototype.component = function(name, comp) {
        if (comp.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: comp });
        } else {
            this.component(name, function() { return comp; });
        }
        
        return this;
    };
    
    Patata.prototype.components = function(components) {
        for (var name in components) {
            this.component(name, components[name]);
        }
        return this;
    };
}