import * as Models from './patata.d';

export class ReportHelper implements Models.IReportHelper {
    
    public toFeature(event:any): Models.IFeature {        
        let result = {
            description: event.getDescription(),
            keyword: event.getKeyword(),
            line: event.getLine(),
            name: event.getName(),
            scenarioKeyword: event.getScenarioKeyword(),
            stepKeywordByLines: event.getStepKeywordByLines(),
            tags: event.getTags(),
            uri: event.getUri(),
        }
        return result;
    }
    
    public toScenario(event:any): Models.IScenario {        
        let result = {
            description: event.getDescription(),
            keyword: event.getKeyword(),
            line: event.getLine(),
            lines: event.getLine(),
            name: event.getName(),
            tags: event.getTags(),
            uri: event.getUri(),
        }
        return result;
    }
    
    public toStep(event:any): Models.IStep {        
        let result = {
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
        }
        return result;
    }

    public toStepResult(event:any): Models.IStepResult {
        var result = {
            duration: event.getDuration(),
            failureException: event.getFailureException(),
            pendingReason: event.getPendingReason(),
            status: event.status
        };
        return result;
    }

    public toScenarioResult(event:any): Models.IScenarioResult {
        var result = {
            duration: event.getDuration(),
            failureException: event.getFailureException(),
            stepCounts: event.getStepCounts(),
            status: event.status
        };
        return result;
    }

    public toFeaturesResult(event:any): Models.IFeaturesResult {
        var result = {
            duration: event.getDuration(),
            isSuccessful: event.isSuccessful(),
            stepCounts: event.getStepCounts(),
            scenarioCounts: event.getScenarioCounts()
        };
        return result;
    }
}