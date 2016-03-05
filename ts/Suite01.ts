"use strict";
declare var require: any;

import chai = require('chai');
var wd = require('wd');

var expect = chai.expect;

describe("ABC", () => {
    /*describe("Local", () => {
        
        xit("should have this", () => {
            expect(1 + 1 === 2);        
        });

    });*/

    describe('Android', () => {
        var driver;
        var allPassed = true;

        before(function () {
            this.timeout(300000);
            driver = wd.promiseChainRemote({
                host: 'localhost',
                port: 4723
            });

            var desired = {
                browserName: '',
                'appium-version': '1.3',
                platformName: 'Android',
                platformVersion: '4.4.2',
                deviceName: '192.168.56.101:5555',
                app: 'http://appium.github.io/appium/assets/ApiDemos-debug.apk',
                name: 'android - simple',
                tags: ['sample']
            };

            return driver.init(desired);//.setImplicitWaitTimeout(3000);
        });

        after(function () {
            return driver
                .quit()
                .finally(function () {
                });
        });

        afterEach(function () {
            allPassed = allPassed && this.currentTest.state === 'passed';
        });

        it('should do something', () => {
            return driver
                .elementByAccessibilityId('Graphics')
                .click()
                /*.elementByAccessibilityId('Arcs')
                .should.eventually.exist*/
                .back()
                .elementByName('App')
                .should.eventually.exist
                .elementsByAndroidUIAutomator('new UiSelector().clickable(true)')
                .should.eventually.have.length(12)
                .elementsByAndroidUIAutomator('new UiSelector().enabled(true)')
                .should.eventually.have.length.above(20)
                .elementByXPath('//android.widget.TextView[@text=\'API Demos\']')
                .should.exists;
        });
    });
});