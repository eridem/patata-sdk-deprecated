"use strict";
var DefaultReportFactory = (function () {
    function DefaultReportFactory() {
    }
    DefaultReportFactory.prototype.get = function (report) {
        if (report.package === 'json') {
            report.package = './defaults/jsonReport.js';
        }
        return report;
    };
    return DefaultReportFactory;
}());
exports.DefaultReportFactory = DefaultReportFactory;
