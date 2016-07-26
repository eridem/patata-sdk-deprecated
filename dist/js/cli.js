"use strict";
var Q = require('q');
var getPort = require('get-port');
var colors = require('colors');
var extend = require('util')._extend;
var appiumApp;
exports.cli = function (result, patata) {
    function exitHandler(options, err) {
        stopAppium();
        if (options.exit)
            process.exit();
    }
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
    printLogo();
    var argv = require('yargs').argv;
    if (argv._.length === 0) {
        throw "No suites launched. Please use: patata [suite]";
    }
    // Get suite name
    var suiteCli = argv._[0];
    // Fix default values
    fixDefaultValues(patata, suiteCli).then(function (patata) {
        // Current suite
        var currentSuite = patata.getSuite(suiteCli);
        // Init suite
        patata.init(suiteCli);
        // Create cucumber args
        var cucumberArgs = createCucumberArgs(patata);
        // Start appium
        startAppium(currentSuite).then(function () {
            // Init cucumber with args
            startCucumber(cucumberArgs);
        }).catch(function (error) {
            exitWithError(error);
        });
    }).catch(function (error) {
        exitWithError(error);
    });
    //
    // Fix default suite values that were optional
    // on the patata configuration suite from patatafile.js
    //
    function fixDefaultValues(patata, suiteCli) {
        var deferred = Q.defer();
        // Current suite
        var currentSuite = patata.getSuite(suiteCli);
        // Fix features default values
        currentSuite.features = currentSuite.features || {};
        currentSuite.features.files = currentSuite.features.files || [];
        currentSuite.features.tags = currentSuite.features.tags || [];
        currentSuite.features.scenarios = currentSuite.features.scenarios || [];
        // Reports
        currentSuite.reports = currentSuite.reports || [];
        var afterAssignPort = function (currentSuite) {
            // Fix port=address
            currentSuite.servers.forEach(function (server) {
                server.host = server.host || server.address;
            });
            // Replace previous suite with complete values
            patata.suite(suiteCli, currentSuite);
            // Return
            deferred.resolve(patata);
        };
        // Fix server default values        
        if (currentSuite.servers && currentSuite.servers.length) {
            afterAssignPort(currentSuite);
        }
        else {
            getPort().then(function (port) {
                currentSuite.servers = [{ host: 'localhost', port: port }];
                afterAssignPort(currentSuite);
            });
        }
        return deferred.promise;
    }
    //
    // Start appium based on the patata configuration suite
    // 
    function startAppium(currentSuite) {
        // User first server (TODO: be able to use more servers)
        var server = currentSuite.servers[0];
        var appiumArgs = require(process.cwd() + '/node_modules/appium/build/lib/parser').getDefaultArgs();
        appiumArgs.address = server.host;
        appiumArgs.port = server.port;
        appiumArgs.debugLogSpacing = true;
        appiumArgs.loglevel = 'warning';
        server = extend(appiumArgs, server);
        require(process.cwd() + '/node_modules/appium/build/lib/main').main(appiumArgs);
        // Create appium arguments
        //var cmd = 'appium -p ' + server.port + ' -a ' + server.host;
        // Exec appium
        //appiumApp = require('child_process').exec(cmd);
        var deferred = Q.defer();
        setTimeout(deferred.resolve, 5000);
        return deferred.promise;
    }
    function stopAppium() {
        if (appiumApp && typeof appiumApp.exit === 'function') {
            console.log("Stopping Appium...");
            appiumApp.exit();
            console.log("Appium stopped...");
        }
    }
    //
    // Create the neccesary cucumber args based on
    // the patata configuration suite.
    //
    function createCucumberArgs(patata) {
        // Load Patata support files for Cucumber
        var supportDir = process.cwd() + '/node_modules/patata/dist/js/cucumber/support/';
        // Create default arguments for cucumber
        var defaultArgs = ['', '', '--require', supportDir];
        var featureFilesArgs = buildWithArgs('', patata.currentSuite.features.files, '');
        var featureTagArgs = buildWithArgs('', patata.currentSuite.features.tags, '--tags');
        var featureScenarioArgs = buildWithArgs('', patata.currentSuite.features.scenarios, '--name');
        var componentsArgs = buildWithArgs(process.cwd() + '/', patata.currentSuite.components, '--require');
        var implementationArgs = buildWithArgs(process.cwd() + '/', patata.currentSuite.include, '--require');
        // Build cucumber args
        var args = defaultArgs;
        args = args.concat(featureTagArgs);
        args = args.concat(featureScenarioArgs);
        args = args.concat(componentsArgs);
        args = args.concat(implementationArgs);
        args = args.concat(featureFilesArgs);
        // Print on screen
        printMessage(patata, args);
        return args;
    }
    //
    // Start cucumber cli based on arguments
    //
    function startCucumber(args) {
        // Init cucumber
        var Cucumber = require('cucumber');
        var cucumberCli = Cucumber.Cli(args);
        var cucumberCliAction = function (succeeded) {
            stopAppium();
            var code = succeeded ? 0 : 1;
            function exitNow() {
                process.exit(code);
            }
            if (process.stdout.write('')) {
                exitNow();
            }
            else {
                // write() returned false, kernel buffer is not empty yet...
                process.stdout.on('drain', exitNow);
            }
        };
        cucumberCli.run(cucumberCliAction);
    }
    //
    // Create an cli arguments based on an array and prefix. If not prefix, pass null.
    // Eg. (prefix = '--letter') and (anyArray = ['a','b','c'])
    //     Result: ['--letter a', '--letter b', '--letter c']
    // Useful to create arguments for appium cli
    //
    function buildWithArgs(prefix, anyArray, argName) {
        var result = [];
        for (var i = 0; i < anyArray.length; i++) {
            if (argName) {
                result.push(argName);
            }
            result.push(prefix + anyArray[i]);
        }
        return result;
    }
    function exitWithError(message) {
        stopAppium();
        console.error(message);
        process.exit(1);
    }
    function printMessage(patata, args) {
        try {
            console.log("Tags:".cyan, "\t\t " + patata.currentSuite.features.tags);
            console.log("Scenarios:".cyan, "\t " + patata.currentSuite.features.scenarios);
            console.log("Components:".cyan, "\t " + patata.currentSuite.components);
            console.log("Include:".cyan, "\t " + patata.currentSuite.include);
            console.log("Features:".cyan, "\t " + patata.currentSuite.features.files);
            console.log("Reports:".cyan, "\t " + JSON.stringify(patata.reports));
            console.log("\n");
            console.log('Appium: ', "\t" + JSON.stringify(patata.currentSuite.servers));
            console.log("Cucumber:".cyan, "\t" + JSON.stringify(args.slice(2)));
            console.log("\n");
        }
        catch (ex) {
            console.warn('There was a problem showing summary messages.');
        }
    }
    function printLogo() {
        console.log("\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0__\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0__\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0__\n".yellow +
            "______\u00A0\u00A0_____\u00A0\u00A0\u00A0_/\u00A0\u00A0|_\u00A0_____\u00A0\u00A0\u00A0_/\u00A0\u00A0|_\u00A0_____\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0|__|\u00A0\u00A0____\n".yellow +
            "\\____\u00A0\\\u00A0\\__\u00A0\u00A0\\\u00A0\u00A0\\\u00A0\u00A0\u00A0__\\\\__\u00A0\u00A0\\\u00A0\u00A0\\\u00A0\u00A0\u00A0__\\\\__\u00A0\u00A0\\\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0|\u00A0\u00A0|\u00A0/\u00A0\u00A0_\u00A0\\\n".yellow +
            "|\u00A0\u00A0|_>\u00A0>\u00A0/\u00A0__\u00A0\\_\u00A0|\u00A0\u00A0|\u00A0\u00A0\u00A0/\u00A0__\u00A0\\_\u00A0|\u00A0\u00A0|\u00A0\u00A0\u00A0/\u00A0__\u00A0\\_\u00A0\u00A0\u00A0\u00A0|\u00A0\u00A0|(\u00A0\u00A0<_>\u00A0)\n".yellow +
            "|\u00A0\u00A0\u00A0__/\u00A0(____\u00A0\u00A0/\u00A0|__|\u00A0\u00A0(____\u00A0\u00A0/\u00A0|__|\u00A0\u00A0(____\u00A0\u00A0/\u00A0/\\\u00A0|__|\u00A0\\____/\n".yellow +
            "|__|\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\\/\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\\/\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\\/\u00A0\u00A0\\/\n".yellow);
    }
};
