"use strict";

module.exports = function() {
    var config = require('../lib/config/index');

    config
        .createComponent('NOTIFICATIONS_GOTIT_BTN', function() { return this.elementById('btnGotIt'); })
        .createComponent('STARTPAGE_CASINO_BTN', function() { return this.elementById('startpage_product_casino_view'); })
        .createComponent('LEFT_MENU_BURGER', function() { return this.elementById('ib_menu_left'); })
        .createConfigurableComponent('LEFT_MENU_WITH_TITLE', function(title) { 
            return this.elementByXPath('//*[@text="{0}"]'.replace(/\{0\}/gi, title)); 
        });
}