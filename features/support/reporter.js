"use strict";

/*
var report = [];

var reporter = function () {
    this.registerHandler('BeforeFeatures', function (event, callback) {
        var handlerName = 'BeforeFeatures';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('BeforeFeature', function (event, callback) {
        var handlerName = 'BeforeFeature';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('BeforeScenario', function (event, callback) {
        var handlerName = 'BeforeScenario';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('BeforeStep', function (event, callback) {
        var handlerName = 'BeforeStep';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('AfterStep', function (event, callback) {
        var handlerName = 'AfterStep';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('StepResult', function (event, callback) {
        var handlerName = 'StepResult';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('AfterFeature', function (event, callback) {
        var handlerName = 'AfterFeature';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('AfterFeatures', function (event, callback) {
        var handlerName = 'AfterFeatures';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        callback();
    });

    this.registerHandler('AfterScenario', function (event, callback) {
        var handlerName = 'AfterScenario';
        var eventName = event.getName();
        report.push({
           handlerName: handlerName,
           eventName: eventName 
        });
        console.log(JSON.stringify(report));
        callback();
    });
};

module.exports = reporter;
*/