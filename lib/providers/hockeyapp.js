"use strict";

module.exports = function (config) {
    if (!config) return;
        
    var deferred = require('q').defer();
        
    // Import module
    var HockeyApp = require('hockeyapp-api-wrapper');

    var fs = require('fs');
    var hockeyAppConfig = JSON.parse(fs.readFileSync('hockeyapp.json', 'utf8'));

    // HockeyApp Auth Token
    var YOUR_HOCKEYAPP_AUTH_TOKEN = hockeyAppConfig.authToken;

    // Init client
    var hockeyAppCli = new HockeyApp.Client(YOUR_HOCKEYAPP_AUTH_TOKEN);

    hockeyAppCli.getApps().then(function (appsResponse) {
        var app = HockeyApp.Utils.getAppByTitleMatch(appsResponse, config.getOptions().app);

        hockeyAppCli.getVersions(app).then(function (versionResponse) {
            var version = HockeyApp.Utils.getLatestVersion(versionResponse);

            var downloadUrl = hockeyAppCli.getLatestAndroidVersionDownloadLink(app, version);

            console.log("      HOCKEYAPP".blue, "Download App URL generated".grey);
            deferred.resolve({ binary: downloadUrl });
        });
    });

    return deferred.promise;
}