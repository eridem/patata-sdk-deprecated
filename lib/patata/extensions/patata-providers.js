"use strict";

module.exports = function(Patata) {
    if (!Patata) return;
       
    Patata.prototype.provider = function(implicitWait) {
        this.implicitWait = implicitWait || 3 * 1000;
        // Provider
        var ProviderFactory = require('../../providers/provider-factory');
        var provider = new ProviderFactory(this.driver, this.desired, this.implicitWait);  
        return provider.create(this);
    }
    
    Patata.prototype.getBinary = function () {
        var Q = require('q');
        var deferred = Q.defer();

        var fla = this.getFlavour();
        if (!fla.useProvider) {
            deferred.resolve(fla.binary);
        } else {
            require('../../providers/' + fla.provider.id)(this, fla.provider, deferred);
        }
        return deferred.promise;
    };
}