"use strict";
// global.scenario

module.exports = function (driver) {
    if (!driver) return;
    driver.on('command', function (meth, path, data) {
        if (path.toString().startsWith('saveScreenshot') || path.toString().startsWith('takeScreenshot')) return;
      
        console.log('      WD'.blue, meth.yellow, path.grey, data || '');

    });
};