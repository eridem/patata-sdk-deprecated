"use strict";

module.exports = function () {
    require('../../components/ui')();

    this.Given(/^I am in the Casino lobby$/, function () {
        return this.client
            .NOTIFICATIONS_GOTIT_BTN
                .should.eventually.exist
                .click()
            .STARTPAGE_CASINO_BTN
                .should.eventually.exist
                .click();
    });

    this.When(/^I open the left toolbar$/, function () {
        return this.client
            .LEFT_MENU_BURGER
            .should.eventually.exist
            .click();
    });

    this.Then(/^I should see "(.*)" item on the menu$/, function (title) {
        return this.client
            .LEFT_MENU_WITH_TITLE(title)
            .should.eventually.exist
            .click();
    });
};