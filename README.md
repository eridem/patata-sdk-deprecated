# Patata

A framework for easy and quick testing of mobile applications using BDD. 

# Install it

```
npm install -g patata-cli
npm install --save patata
```

# Patata keywords

- *[Capabilities](#markdown-header-capabilities)*: device API where the test will be executed.
- *[Components](#markdown-header-components)*: specific device UI elements.
- *[Configs](#markdown-header-configs)*: set of configurations.
- *[Features](#markdown-header-features)*: set of behaviors to test.
    - *[Files](#markdown-header-files)*: set of behaviours categorized by files.
    - *[Tags](#markdown-header-tags)*: set of behaviours categorized by tests.
    - *[Scenarios](#markdown-header-scenarios)*: set of behaviours categorized by scenarios.
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
    configs: ['configs/myBrand' ],
    features: {
        files: ['features/set_01', 'features/set_02'],
        tags: ['@tag01,@tag02'], 
        scenarios: ['name01', 'name02']
    },
    provider: {
        path: 'apps/test.apk'
    },
    servers: [{ host: 'localhost', port: 4723 }]    /* Optional */
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

Features can be organized in folders, tags or scenarios. Those can be referenced on the *patatafile.js*.

- ***files***: set of strings that represents relative paths:
    - *['features/set01', 'features/set02']*: folders and subfolders from those paths.
- ***scenarios***: set of regular expressions by name:
    - *['topic_a', 'topic_b']*
    - *['topic_?']*
- ***tags***: using the name of the tags from the tests:
    - *['@tag1']*: all that contains that tag
    - *['~@tag2']*: all that does not contain that tag
    - *['@tag1,@tag2']*: all that contains the first tag OR the second tag.
    - *['@tag1', '@tag2']*: all that contains the first thag AND the second tag.

```
//...

patata.suite('suite01', {
    
    features: {
        files: ['features/set_01', 'features/set_02'],
        tags: ['@tag01,@tag02'], 
        scenarios: ['name01', 'name02']
    },
    
});

//...
```

More info here about features, scenarios and tags: [CucumberJS](https://github.com/cucumber/cucumber-js)

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