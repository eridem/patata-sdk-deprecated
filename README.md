# Patata

A framework for easy and quick testing mobile applications using BDD. 

Based on open sources projects (Cucumber and Appium), Patata's goals are:

- Focus on implementation of the test, forget about doing relationship between packages. Everything should work by default!
- Create one single test that can work on *iOS* and *Android*.
- Create single components for specific *iOS* and *Android* tests without changing the tests.
- Organize your suites in a single file.

# Install it

```
npm install -g patata-cli
npm install --save patata
```

# Patata keywords

- *[Capabilities](#markdown-header-capabilities)*: device API where the test will be executed.
- *[Components](#markdown-header-components)*: specific device UI elements.
- *[Features](#markdown-header-features)*: set of behaviors to test.
- *[Providers](#markdown-header-providers)*: where the binaries of the app can be obtained.
- *[Servers](#markdown-header-servers)*: emulator server where the tests will be executed.

# Patatafile.js

The *patatafile.js* is a special file that will help us to include our suites and configurations. This file is used by the *patata-cli*.

```
"use strict";

var patata = require('patata');

patata.suite('suite01', {
    capability: 'android19',
    components: ['components/android'],
    features: ['features/set_01', 'features/set_02'],
    provider: {
        path: 'apps/test.apk'
    }
});
```

## Run suites

Based on the previous *patatafile.js* example, open your terminal and write:

```
patata suite01
```

# Capabilities

Device API. At the current moment, it is possible the following values:

- *ios81*
- *android18*
- *android19*

# Components

Components are one of the powerful features of Patata: split device specific from feature.

E.g. file: components/android/ui.js

```
"use strict";

module.exports = function() {
    var patata = require('patata');

    patata.components({       
        'LOGIN_BUTTON': function() { 
            return this.elementByName('login_button_android').should.eventually.exist; 
        },
        'LEFT_MENU_BUTTON': function() { 
            return this.elementByName('left_menu_android').should.eventually.exist; 
        }
    });
}
```

E.g. file: components/ios/ui.js

```
"use strict";

module.exports = function() {
    var patata = require('patata');

    patata.components({       
        'LOGIN_BUTTON': function() { 
            return this.elementByName('ios_login_btn').should.exist; 
        },
        'LEFT_MENU_BUTTON': function() { 
            return this.elementByName('ios_menu_btn').should.exist; 
        }
    });
}
```

In these files, we create two components called "*LOGIN_BUTTON*" and "*LEFT_MENU_BUTTON*".

Both files contains the same component names, but the implementation of them are specific for *Android* and *iOS*.

## Components on *patatafile.js*

We can create multiple files with components in different paths. The *suite* section of the *patatafile.js* contains an option to set multiple directory paths and/or files:

```
//...

patata.suite('suite01', {
    
    components: ['components/android'],
    
});

//...
```

You can decide how to split and organize your components files and folders.

# Features

Features are based on the Cucumber folder structure. More info here: [CucumberJS](https://github.com/cucumber/cucumber-js)

Features can be organized in folders and can be referenced on the *patatafile.js* in the following way as example:

```
//...

patata.suite('suite01', {
    
    features: ['features/set_01', 'features/set_02'],
    
});

//...
```

# Providers

Providers will help us to fetch the binary file.

By default, it exists one plugin to fetch the file from the file system or http. It can be configured in the following way on the *patatafile.js*:

```
//...

patata.suite('suite01', {
    
    provider: {
        path: RELATIVE_PATH_TO_FILE
    },
    
});

//...
```

# Servers

By default, Patata uses the local Appium server, but this can be modified to use one or more servers to test.

```
//...

patata.suite('suite01', {
    
    servers: [{ host: 'localhost', port: 4723 }],
        
});

//...
```