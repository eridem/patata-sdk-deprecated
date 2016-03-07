"use strict";
// global.scenario

module.exports = function (driver) {
    if (!driver) return;
    
    var zeroPad = function (num, places) {
        places = places || 3;
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    var screenshotNumber = 0;

    // See whats going on
    driver.on('status', function (info) {
        //console.log(info.cyan);
    });
    driver.on('command', function (meth, path, data) {
        if (path.toString().startsWith('saveScreenshot') || path.toString().startsWith('takeScreenshot')) return;
      
        if (meth === 'CALL') {
            driver.saveScreenshot('./reports/screenshots/' + zeroPad(screenshotNumber) + '_CALL.png');
        } else if (meth === 'RESPONSE') {
            driver.saveScreenshot('./reports/screenshots/' + zeroPad(screenshotNumber) + '_RESPONSE.png');
            screenshotNumber++;
        }

    });
    driver.on('http', function (meth, path, data) {
        //console.log('   - ' + meth.magenta, path, (data || '').grey);
    });
};