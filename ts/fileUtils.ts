import * as Models from './patata.d';

export class FileUtils implements Models.IFileUtils {
    public generateResultsFilePath(extension: string): string {
        return this.generateFilePath('./results-', extension);
    }
    
    private generateFilePath(prefix: string, extension: string): string {
       return prefix + new Date().toISOString()
            .replace(/[-|:|Z|\.]/gi, '')
            .replace(/T/gi, '-') + '.' + extension;
    }
}