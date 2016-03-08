"use strict";

module.exports = function() {
    var config = require('../lib/patata/patata');

    config.components({
        'NOTIFICATIONS_GOTIT_BTN':  function() { return this.elementById('btnGotIt'); },
        'STARTPAGE_CASINO_BTN':     function() { return this.elementById('startpage_product_casino_view'); },
        'LEFT_MENU_BURGER':         function() { return this.elementById('ib_menu_left'); },
        'LEFT_MENU_WITH_TITLE':     function(title) { return this.elementByXPath('//*[@text="{0}"]'.replace(/\{0\}/gi, title)); }
    });
}