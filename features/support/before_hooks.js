"use strict";

var hooks = function () {
    this.Before(function (scenario) {
        global.scenario = scenario;
        
        require("../../helpers/setup");

        var wd = require("wd"),
            _ = require('underscore'),
            serverConfigs = require('../../helpers/appium-servers');

        var serverConfig = process.env.SAUCE ?
            serverConfigs.sauce : serverConfigs.local;
        this.driver = wd.promiseChainRemote(serverConfig);
        require("../../helpers/logging").configure(this.driver);

        var desired = process.env.SAUCE ?
            _.clone(require("../../helpers/caps").android18) :
            _.clone(require("../../helpers/caps").android19);
        desired.app = require("../../helpers/apps").androidApiDemos;
        if (process.env.SAUCE) {
            desired.name = 'android - simple';
            desired.tags = ['sample'];
        }
        return this.driver
            .init(desired)
            .setImplicitWaitTimeout(3 * 1000);
    });
};

module.exports = hooks;