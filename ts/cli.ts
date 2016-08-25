"use strict";

import * as Models from './patata.d';
const path = require('path')
const getPort = require(path.join(__dirname, './utils/get-port'));
const colors = require('colors');
const extend = require('util')._extend;
const asciify = require('asciify')

var appiumApp;

exports.cli = function (opts) {
    let { suiteName, patata, logType = 'warning' } = opts;
    let mainResolve = opts.resolve;
    let mainReject = opts.reject
    
    patata.log.setShowType(logType)

    if (typeof suiteName !== 'string') {
        var argv = process.argv;
        if (argv.length < 3) {
            throw "No suites launched. Please use: patata [suite]";
        }

        // Get suite name
        suiteName = argv[2];
    }

    const exitHandler = (options, err) => {
        stopAppium();
        return mainResolve();
    }

    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));

    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));

    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

    printLogo().then(function () {
        if (!suiteName) {
            throw patata.log.getError("No suites launched. Please use: patata -s [suite]");
        }

        patata.log.verbose('Fixing default values...')

        // Fix default values
        fixDefaultValues(patata, suiteName).then(function (patata: Models.IPatata) {
            patata.log.verbose('Loading suite...')

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
        return new Promise((resolve, reject) => {
            // Current suite
            var currentSuite = patata.getSuite(suiteName);

            // Fix features default values
            currentSuite.features = currentSuite.features || {};
            currentSuite.features.files = currentSuite.features.files || [];
            currentSuite.features.tags = currentSuite.features.tags || [];
            currentSuite.features.scenarios = currentSuite.features.scenarios || [];

            // Reports
            currentSuite.reports = currentSuite.reports || [];

            var afterAssignPort = (currentSuite) => {
                // Fix port=address
                currentSuite.servers.forEach(function (server) {
                    server.host = server.host || server.address;
                });
                // Replace previous suite with complete values
                patata.suite(suiteName, currentSuite);
                // Return
                resolve(patata);
            };
            var fixPort = function (server) {
                return new Promise((resolve, reject) => {
                    if (!server.port) {
                        getPort().then(function (port) {
                            server.port = port;
                            resolve(server);
                        });
                    } else {
                        resolve(server);
                    }
                })
            }

            // Fix server default values        
            if (currentSuite.servers && currentSuite.servers.length) {
                var portPromises = [];
                currentSuite.servers.forEach(function (server) {
                    portPromises.push(fixPort(server));
                });

                Promise.all(portPromises).then(values => {
                    currentSuite.servers = values;
                    afterAssignPort(currentSuite);
                });
            }
            else {
                fixPort({ host: 'localhost', port: null }).then(function (server) {
                    currentSuite.servers = [server];
                    afterAssignPort(currentSuite);
                });
            }
        })
    }

    //
    // Start appium based on the patata configuration suite
    // 
    function startAppium(currentSuite) {
        // User first server (TODO: be able to use more servers)
        var server = currentSuite.servers[0];

        if (!server.attach) {
            var appiumArgs = require(path.join(process.cwd(), '/node_modules/appium/build/lib/parser')).getDefaultArgs();
            appiumArgs.address = server.host;
            appiumArgs.port = server.port;
            appiumArgs.debugLogSpacing = true;
            appiumArgs.loglevel = 'warning';
            server = extend(appiumArgs, server);

            require(path.join(process.cwd(), '/node_modules/appium/build/lib/main')).main(appiumArgs);
        }

        return new Promise((resolve, reject) => {
            setTimeout(resolve, 5000);
        })
    }

    function stopAppium() {
        if (appiumApp && typeof appiumApp.exit === 'function') {
            patata.warning("Stopping Appium...");
            appiumApp.exit();
            patata.warning("Appium stopped...");
        }
    }

    //
    // Create the neccesary cucumber args based on
    // the patata configuration suite.
    //
    function createCucumberArgs(patata) {
        // Load Patata support files for Cucumber
        var supportDir = path.join(__dirname, '/cucumber/support/');

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
                if (code === 0) {
                    mainResolve()
                } else {
                    mainReject(code)
                }
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
        return mainReject(message)
    }

    function printMessage(patata, args) {
        let suite = patata.currentSuite
        let { features, components, include, servers, capability, reports } = suite
        try {
            patata.log.debug("Tags:", "\t " + (features.tags || '').toString());
            patata.log.verbose("Scenarios:", "\t " + (features.scenarios || '').toString());
            patata.log.verbose("Components:", "\t " + (components || '').toString());
            patata.log.verbose("Include:", "\t " + (include || '').toString());
            patata.log.verbose("Features:", "\t " + (features.files || '').toString());
            patata.log.verbose("Reports:", "\t " + (JSON.stringify(reports) || '').toString() + '\n');
            patata.log.verbose('Appium: ', "\t" + (JSON.stringify(servers) || '').toString());
            patata.log.verbose("Cucumber:", "\t" + (JSON.stringify(args.slice(2)) || '').toString());
            patata.log.verbose("Capabilities:", "\t" + (JSON.stringify(capability) || '').toString() + '\n');
        } catch (ex) {
            patata.log.warning('There was a problem showing summary messages.');
        }
    }

    function printLogo() {
        return new Promise((resolve, reject) => {
            asciify('PATATA', { color: 'yellow' }, function (err, res) {
                patata.log.always('Time for...\n'.yellow + res.yellow + '...and happy testing.\n'.yellow);
                resolve();
            })
        })
    }
};

