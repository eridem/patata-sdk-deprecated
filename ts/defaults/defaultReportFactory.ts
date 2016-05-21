import * as Models from '../patata.d';

export class DefaultReportFactory implements Models.IReportFactory {
    public get(report: any): any {
        if (report.package === 'json') {
            report.package = './defaults/jsonReport.js';
        }
        return report;
    }
}