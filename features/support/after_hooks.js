"use strict";

var hooks = function () {
    this.After(function (scenario) {
        this.driver.takeScreenshot().then(
            function(image, err) {
                scenario.attach(image, 'ímage/png');
            }
        );
               
        this.driver
            .quit();
        return this.driver;
    });
};

module.exports = hooks;