"use strict";

import * as Models from './patata.d';
import * as Q from 'q';
const getPort = require('get-port');
const colors = require('colors');
const extend = require('util')._extend;
const asciify = require('asciify')

var appiumApp;

exports.cli = function (suiteName, patata) {
    if (typeof suiteName !== 'string') {
        var argv = process.argv;
        if (argv.length < 3) {
            throw "No suites launched. Please use: patata [suite]";
        }

        // Get suite name
        suiteName = argv[2];
    }

    function exitHandler(options, err) {
        stopAppium();
        if (options.exit) process.exit();
    }

    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

    printLogo().then(function () {
        if (!suiteName) {
            throw "No suites launched. Please use: patata [suite]";
        }

        console.log(patata.log.getMessage('Fixing default values...'))

        // Fix default values
        fixDefaultValues(patata, suiteName).then(function (patata: Models.IPatata) {
            console.log(patata.log.getMessage('Loading suite...'))

            // Current suite
            var currentSuite = patata.getSuite(suiteName);

            // Init suite
            patata.init(suiteName);

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
    });

    //
    // Fix default suite values that were optional
    // on the patata configuration suite from patatafile.js
    //
    function fixDefaultValues(patata, suiteName) {
        var deferred = Q.defer();

        // Current suite
        var currentSuite = patata.getSuite(suiteName);

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
            patata.suite(suiteName, currentSuite);
            // Return
            deferred.resolve(patata);
        };
        var fixPort = function (server) {
            var fixPortDeferred = Q.defer();

            if (!server.port) {
                getPort().then(function (port) {
                    server.port = port;
                    fixPortDeferred.resolve(server);
                });
            } else {
                fixPortDeferred.resolve(server);
            }

            return fixPortDeferred.promise;
        }

        // Fix server default values        
        if (currentSuite.servers && currentSuite.servers.length) {
            var portPromises = [];
            currentSuite.servers.forEach(function (server) {
                portPromises.push(fixPort(server));
            });

            Q.allSettled(portPromises).then(function (results) {
                var newServers = [];
                results.forEach(function (result) {
                    if (result.state === "fulfilled") {
                        newServers.push(result.value);
                    } else {
                        throw new Error('[Patata] Could not resolve one of the Appium servers. Please try again or verify your settings.');
                    }
                });

                currentSuite.servers = newServers;
                afterAssignPort(currentSuite);
            });
        }
        else {
            fixPort({ host: 'localhost', port: null }).then(function (server) {
                currentSuite.servers = [server];
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

        if (!server.attach) {
            var appiumArgs = require(process.cwd() + '/node_modules/appium/build/lib/parser').getDefaultArgs();
            appiumArgs.address = server.host;
            appiumArgs.port = server.port;
            appiumArgs.debugLogSpacing = true;
            appiumArgs.loglevel = 'warning';
            server = extend(appiumArgs, server);

            require(process.cwd() + '/node_modules/appium/build/lib/main').main(appiumArgs);
        }

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
            } else {
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
            console.log('Appium: '.cyan, "\t" + JSON.stringify(patata.currentSuite.servers));
            console.log("Cucumber:".cyan, "\t" + JSON.stringify(args.slice(2)));
            console.log("Capabilities:".cyan, "\t" + JSON.stringify(patata.capability));
            console.log("\n");
        } catch (ex) {
            console.warn('There was a problem showing summary messages.');
        }
    }

    function printLogo() {
        var logoPromise = Q.defer();
        asciify('patata.io', { color: 'yellow' }, function (err, res) {
            console.log(res);
            logoPromise.resolve();
        })
        return logoPromise.promise;
    }

};

