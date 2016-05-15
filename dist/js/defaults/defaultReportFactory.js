"use strict";
class DefaultReportFactory {
    getByName(name) {
        if (name === 'json') {
            return './defaults/jsonReport.js';
        }
        return null;
    }
}
exports.DefaultReportFactory = DefaultReportFactory;
