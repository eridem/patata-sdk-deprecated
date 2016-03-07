"use strict";

module.exports = {
    android: {
        apps: {
            'betsson': {
                capabilities: 'android19',
                flavours: {
                    'live': {
                        useProvider: false, // This will use HockeyApp if true
                        provider: {
                            id: 'hockeyapp',
                            app: 'Betsson'
                        },
                        binary: process.cwd() + '/apps/test.apk'
                    },
                    'qa': {
                        useProvider: true, // This will use HockeyApp if true
                        provider: {
                            id: 'hockeyapp',
                            app: 'Betsson QA'
                        },
                        binary: process.cwd() + '/apps/test-qa.apk'
                    }
                }
            }
        }
    },
    capabilities: {
        android18: {
            browserName: '',
            'appium-version': '1.3',
            platformName: 'Android',
            platformVersion: '4.3',
            deviceName: 'Android Emulator',
            app: undefined
        },

        android19: {
            browserName: '',
            'appium-version': '1.3',
            platformName: 'Android',
            platformVersion: '4.4.2',
            deviceName: 'Android Emulator',
            app: undefined
        }
    },
    servers: {
        local: {
            host: 'localhost',
            port: 4723
        }
    },
    loggers: [ /*'default', 'screenshot'*/ ]
};