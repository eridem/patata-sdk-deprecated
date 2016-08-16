"use strict";
const colors = require('colors');
class Log {
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
}
exports.Log = Log;
