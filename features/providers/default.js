"use strict";

module.exports = function() {
    var deferred = require('q').defer();
        
    // Get flavour
    var config = require('../config/config');
    var options = config.getOptions();
    var fla = config.getFlavour(options);
    deferred.resolve({ binary: fla.binary });
    
    return deferred.promise;        
}