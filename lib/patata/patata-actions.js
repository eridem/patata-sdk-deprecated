"use strict";

module.exports = function(Patata, patata) {
    if (!Patata) return;
             
    Patata.prototype._actionsInit = function() {
        this.components({ 'I': function(text, args) { 
            if (typeof this[text] === 'function') {
                return this[text](args); 
            } else {
                return this[text]; 
            }
        }});
    }
             
    Patata.prototype.component = function(name, action) {
        if (action.length === 0) {
            Object.defineProperty(Object.prototype, name, { get: action });
        } else {
            this.component(name, function() { return action; });
        }
        return this;
    }
    
    Patata.prototype.components = function(components) {
        for (var name in components) {
            this.component(name, components[name]);
        }
        return this;
    }
    
    patata._actionsInit();
}