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
}