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
    return ReportHelper;
}());
exports.ReportHelper = ReportHelper;
