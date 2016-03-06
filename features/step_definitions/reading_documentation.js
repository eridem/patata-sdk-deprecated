"use strict";

module.exports = function () {
    this.Given(/^I am on the Cucumber.js GitHub repository$/, function (callback) {
        callback();
    });

    this.When(/^I go to the README file$/, function () {
        return this.driver
            .elementByAccessibilityId('Graphics').should.eventually.exist
            .click();
    });

    this.Then(/^I should see "(.*)" as the page title$/, function (title) {
        return this.driver.elementByAccessibilityId('Arcs')
            .click()
            .should.eventually.exist;
    });
};