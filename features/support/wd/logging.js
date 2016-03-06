"use strict";
// global.scenario

exports.configure = function (driver) {
  var zeroPad = function(num, places) {
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
          
          /*
      global.scenario.attach(
          JSON.stringify({
              meth: meth,
              path: path,
              data: data
          })
          , 'application/json');
          
      driver.takeScreenshot().then(
            function(image, err) {
                global.scenario.attach(image, 'ímage/png');
            }
        );*/
      
      //var logEntry = zeroPad(screenshotNumber).yellow + '.' + meth.yellow + ' ' + path.grey + ' ' + data || '';
      //global.scenario.attach(logEntry);
      
    console.log('      WD'.blue, zeroPad(screenshotNumber).red, meth.yellow, path.grey, data || '');

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