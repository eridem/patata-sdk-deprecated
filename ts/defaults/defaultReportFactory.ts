import * as Models from '../patata.d';

export class DefaultReportFactory implements Models.IReportFactory {
    public getByName(name: string): string {
        if (name === 'json') {
            return './defaults/jsonReport.js';
        }
        return null;
    }
}