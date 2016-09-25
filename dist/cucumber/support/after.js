"use strict";
var patata = require('../../index');
var hooks = function () {
    this.After(function (scenario) {
        let appiumMsg = patata.emulator.appiumMsgQueue.slice(0);
        scenario.attach('[APPIUM LOG]');
        appiumMsg.forEach(msg => {
            scenario.attach(`${msg.status}: ${msg.meth}${msg.path ? '\n' + msg.path : ''}${msg.data ? '\n' + msg.data : ''}\n--------`);
        });
        scenario.attach('[/APPIUM LOG]');
        patata.emulator.appiumMsgQueue.length = 0;
        return this.emu.resetApp();
    });
};
module.exports = hooks;
