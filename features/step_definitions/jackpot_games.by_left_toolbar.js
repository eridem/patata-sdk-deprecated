"use strict";

module.exports = function () {
    this.Given(/^I am in the Casino lobby$/, function () {
        return this.driver
            .elementById('btnGotIt')
            .should.eventually.exist
            .click()
            .elementById('startpage_product_casino_view')
            .should.eventually.exist
            .click();
    });

    this.When(/^I open the left toolbar$/, function () {
        return this.driver
            .elementById('ib_menu_left')
            .should.eventually.exist
            .click();
    });

    this.Then(/^I should see "(.*)" item on the menu$/, function (title) {
        return this.driver
            .elementByXPath('//*[@text="{0}"]'.replace(/\{0\}/gi, title))
            .should.eventually.exist
            .click();
    });
};