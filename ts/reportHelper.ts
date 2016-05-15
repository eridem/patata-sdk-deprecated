import * as Models from './patata.d';

export class ReportHelper implements Models.IReportHelper {
    
    public toFeature(event:any): Models.IFeature {        
        let cFeature = event.getPayloadItem('feature');
        let result = {
            background: cFeature.getBackground(),
            description: cFeature.getDescription(),
            //featureElements: cFeature.getFeatureElements(),
            keyword: cFeature.getKeyword(),
            //lastFeatureElement: cFeature.getLastFeatureElement(),
            line: cFeature.getLine(),
            name: cFeature.getName(),
            tags: cFeature.getTags(),
            uri: cFeature.getUri(),
        }
        return result;
    }
    
    public toScenario(event:any): Models.IScenario {        
        let cScenario = event.getPayloadItem('scenario');
        let result = {
            background: cScenario.getBackground(),
            description: cScenario.getDescription(),
            //lastStep: cScenario.getLastStep(),
            keyword: cScenario.getKeyword(),
            line: cScenario.getLine(),
            name: cScenario.getName(),
            ownTags: cScenario.getOwnTags(),
            scenarioOutlineLine: cScenario.getScenarioOutlineLine(),
            //steps: cScenario.getSteps(),
            tags: cScenario.getTags(),
            uri: cScenario.getUri(),
            isScenarioOutline: cScenario.isScenarioOutline()
        }
        return result;
    }
    
    public toStep(event:any): Models.IStep {        
        let cStep = event.getPayloadItem('step');
        let result = {
            attachment: cStep.getAttachment(),
            attachmentContents: cStep.getAttachmentContents(),
            dataTable: cStep.getDataTable(),
            docString: cStep.getDocString(),
            keyword: cStep.getKeyword(),
            line: cStep.getLine(),
            name: cStep.getName(),
            //previousStep: cStep.getPreviousStep(),
            uri: cStep.getUri(),
            isEventStep: cStep.isEventStep(),
            isHidden: cStep.isHidden(),
            isOutcomeStep: cStep.isOutcomeStep(),
            isOutlineStep: cStep.isOutlineStep(),
            isPrecededByEventStep: cStep.isPrecededByEventStep(),
            isPrecededByOutcomeStep: cStep.isPrecededByOutcomeStep(),
            isRepeatingEventStep: cStep.isRepeatingEventStep(),
            isRepeatingOutcomeStep: cStep.isRepeatingOutcomeStep(), 
        }
        return result;
    }        
}