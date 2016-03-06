var Report = require('cucumber-html-report');

var options = {
  source: './report.json', // source json
  dest: './reports', // target directory (will create if not exists)
  name: 'report.html', // report file name (will be index.html if not exists)
  template: 'template.html' // your custom mustache template (uses default if not specified)
};

var report = new Report(options);
report.createReport();