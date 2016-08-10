"use strict";
var ReportHelper = (function () {
    function ReportHelper() {
    }
    ReportHelper.prototype.toFeature = function (event) {
        var result = {
            description: event.getDescription(),
            keyword: event.getKeyword(),
            line: event.getLine(),
            name: event.getName(),
            scenarioKeyword: event.getScenarioKeyword(),
            stepKeywordByLines: event.getStepKeywordByLines(),
            tags: event.getTags(),
            uri: event.getUri(),
        };
        return result;
    };
    ReportHelper.prototype.toScenario = function (event) {
        var result = {
            description: event.getDescription(),
            keyword: event.getKeyword(),
            line: event.getLine(),
            lines: event.getLine(),
            name: event.getName(),
            tags: event.getTags(),
            uri: event.getUri(),
        };
        return result;
    };
    ReportHelper.prototype.toStep = function (event) {
        var result = {
            arguments: event.getArguments(),
            keyword: event.getKeyword(),
            line: event.getLine(),
            lines: event.getLines(),
            name: event.getName(),
            uri: event.getUri(),
            uris: event.getUri(),
            isEventStep: event.isEventStep(),
            isHidden: event.isHidden(),
            isOutcomeStep: event.isOutcomeStep(),
            isPrecededByEventStep: event.isPrecededByEventStep(),
            isPrecededByOutcomeStep: event.isPrecededByOutcomeStep(),
            isRepeatingEventStep: event.isRepeatingEventStep(),
            isRepeatingOutcomeStep: event.isRepeatingOutcomeStep(),
        };
        return result;
    };
    ReportHelper.prototype.toStepResult = function (event) {
        var result = {
            duration: event.getDuration(),
            failureException: event.getFailureException(),
            pendingReason: event.getPendingReason(),
            status: event.status
        };
        return result;
    };
    ReportHelper.prototype.toScenarioResult = function (event) {
        var result = {
            duration: event.getDuration(),
            failureException: event.getFailureException(),
            stepCounts: event.getStepCounts(),
            status: event.status
        };
        return result;
    };
    ReportHelper.prototype.toFeaturesResult = function (event) {
        var result = {
            duration: event.getDuration(),
            isSuccessful: event.isSuccessful(),
            stepCounts: event.getStepCounts(),
            scenarioCounts: event.getScenarioCounts()
        };
        return result;
    };
    return ReportHelper;
}());
exports.ReportHelper = ReportHelper;
