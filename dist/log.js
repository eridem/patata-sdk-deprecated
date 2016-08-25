"use strict";
const colors = require('colors');
class Log {
    constructor() {
        this._mapTypes = {
            'verbose': 1,
            'debug': 5,
            'warning': 10
        };
        this._showType = this._mapTypes['warning'];
    }
    get showType() {
        return this._showType;
    }
    set showType(value) {
        this._showType = value;
    }
    setShowType(type) {
        type = type || '';
        type = type.toLowerCase();
        if (this._mapTypes[type]) {
            this.showType = this._mapTypes[type];
        }
        else {
            this.showType = this._mapTypes['warning'];
        }
    }
    getMessage(message) {
        return '[Patata] '.yellow + message.gray;
    }
    getMessageWithCustomColors(message) {
        return '[Patata] '.yellow + message;
    }
    getErrorMessage(message) {
        return '[Patata] '.yellow + message.red;
    }
    getError(message) {
        return new Error('[Patata] ' + message);
    }
    verbose(message, extra = '') {
        if (this.showType <= this._mapTypes['verbose']) {
            console.log('[Patata]'.gray, message.gray, extra ? extra.blue : '');
        }
    }
    debug(message, extra) {
        if (this.showType <= this._mapTypes['debug']) {
            console.log('[Patata]'.blue, message.gray, extra ? extra.green : '');
        }
    }
    warning(message, extra) {
        if (this.showType <= this._mapTypes['warning']) {
            console.log('[Patata]'.yellow, message.gray, extra ? extra.blue : '');
        }
    }
    always(message, extra) {
        console.log('[Patata]'.white, message.yellow, extra ? extra.blue : '');
    }
}
exports.Log = Log;
