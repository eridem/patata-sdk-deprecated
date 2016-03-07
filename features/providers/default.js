"use strict";

module.exports = function (config) {
    if (!config) return;
    
    var deferred = require('q').defer();
        
    // Get flavour
    //var config = require('../config/config');
    var options = config.getOptions();
    var fla = config.getFlavour(options);
    deferred.resolve({ binary: fla.binary });

    return deferred.promise;
}