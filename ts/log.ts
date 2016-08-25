import * as Models from './patata.d';
const colors = require('colors')

export class Log implements Models.ILog {
    private _mapTypes = {
        'verbose': 1,
        'debug': 5,
        'warning': 10
    }

    private _showType: number = this._mapTypes['warning']

    private get showType(): number {
        return this._showType;
    }
    private set showType(value: number): void {
        this._showType = value;
    }

    public setShowType(type: string): void {
        type = type || ''
        type = type.toLowerCase()

        if (this._mapTypes[type]) {
            this.showType = this._mapTypes[type]
        } else {
            this.showType = this._mapTypes['warning']
        }
    }

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

    public verbose(message, extra = ''): void {
        if (this.showType <= this._mapTypes['verbose']) {
            console.log('[Patata]'.gray, message.gray, extra ? extra.blue : '');
        }
    }

    public debug(message, extra): void {
        if (this.showType <= this._mapTypes['debug']) {
            console.log('[Patata]'.blue, message.gray, extra ? extra.green : '');
        }
    }

    public warning(message, extra): void {
        if (this.showType <= this._mapTypes['warning']) {
            console.log('[Patata]'.yellow, message.gray, extra ? extra.blue : '');
        }
    }

    public always(message, extra): void {
        console.log('[Patata]'.white, message.yellow, extra ? extra.blue : '');
    }
}