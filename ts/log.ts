import * as Models from './patata.d';
const colors = require('colors')

export class Log implements Models.ILog {
    public getMessage(message): string {
        return '[Patata] '.yellow + message.gray;
    } 

    public getMessageWithCustomColors(message: string):string {
        return '[Patata] '.yellow + message;
    } 

    public getErrorMessage(message): string {
        return '[Patata] '.yellow + message.red;
    }

    public getError(message): Error {
        return new Error('[Patata] ' + message);
    }
}