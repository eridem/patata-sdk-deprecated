"use strict";

module.exports = function (driver) {
    if (!driver) return;
    
    var screenshotNumber = 0;
    var zeroPad = function (num, places) {
        places = places || 3;
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    driver.on('command', function (meth, path, data) {
        if (path.toString().startsWith('saveScreenshot') || path.toString().startsWith('takeScreenshot')) return;
      
        if (meth === 'CALL') {
            driver.saveScreenshot('./reports/screenshots/' + zeroPad(screenshotNumber) + '_CALL.png');
        } else if (meth === 'RESPONSE') {
            driver.saveScreenshot('./reports/screenshots/' + zeroPad(screenshotNumber) + '_RESPONSE.png');
            screenshotNumber++;
        }

    });
};