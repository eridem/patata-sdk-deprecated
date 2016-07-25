import * as Models from './patata.d';

export class Log implements Models.ILog {
    public getErrorMessage(message): string {
        return `[Patata] ${message}`;
    }

    public getError(message): Error {
        return new Error(this.getErrorMessage(message));
    }
}