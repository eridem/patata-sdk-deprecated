"use strict";

var hooks = function () {
    this.After(function (scenario) {
        console.log("      WD".blue, "Quit".grey);

        this.driver
            .quit();
        return this.driver;
    });
};

module.exports = hooks;