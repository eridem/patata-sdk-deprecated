"use strict";

function ProviderFactory(driver, desired, implicitWait) {
    // Save values
    this.driver = driver;
    this.desired = desired;
    this.implicitWait = implicitWait;
}

ProviderFactory.prototype.create = function (config) {     
    // Get flavour
    var options = config.getOptions();
    var fla = config.getFlavour(options);
    var provider = fla.provider;
    var providerId = !fla.useProvider ? 'default' : provider.id;

    console.log("      PROVIDER".blue, "Start".grey, providerId.gray);        
                   
    // Prepare callback
    this.deferred = require('q').defer();

    // Load provider and pass options
    require('../providers/' + providerId)(config, provider).then(
        (function (providerFactory) {
            return function (providerOptions) {
                console.log("      PROVIDER".blue, "End".grey, providerId.gray.grey);

                // Attach app url (http or file)
                providerFactory.desired.app = providerOptions.binary;
                
                // Init driver
                providerFactory.initDriver();
            };
        })(this));

    return this.deferred.promise;
}

ProviderFactory.prototype.initDriver = function () {
    console.log("      WD".blue, "Init".grey);
                        
    // Init driver
    this.driver
        .init(this.desired)
        .setImplicitWaitTimeout(this.implicitWait)
        .then((function(deferred) { 
            return function () {
                // Back to app
                deferred.resolve();
        }})(this.deferred));
}

module.exports = ProviderFactory;