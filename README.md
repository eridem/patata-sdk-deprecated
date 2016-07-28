# Patata

A framework for easy and quick testing of mobile applications using BDD. 

![Patata](http://patata.io/icon.png)

# Install it

```
npm install -g patata-cli
npm install --save patata
```

# Patata keywords

- *[Components](#markdown-header-components)*: specific device UI elements.
- *[Capabilities](#markdown-header-capabilities)*: device API where the test will be executed.
    - *Default Patata Capabilities*: set of default capabilities.
    - *Custom Capabilities*: default your own personal capabilities.
    - *Template Capabilities*: combine both default with custom capabilities.
- *[Include](#markdown-header-include)*: set of files where the implementation of the tests are.
- *[Config](#markdown-header-config)*: set of custom configurations which we can use on our tests or components.
- *[Features](#markdown-header-features)*: set of behaviors to test.
    - *Files*: set of behaviours categorized by files.
    - *Tags*: set of behaviours categorized by tests.
    - *Scenarios*: set of behaviours categorized by scenarios.
- *[Providers](#markdown-header-providers)*: where the binaries of the app can be obtained.
- *[Reports](#markdown-header-reports)*: how the output is created. Support integration too.
- *[Servers](#markdown-header-servers)*: emulator server where the tests will be executed.

# Patatafile.js

The ```patatafile.js``` is a special file that will help us to include our suites and configurations. This file is used by the ```patata-cli```.

```
"use strict";

var patata = require('patata');

patata.suite('suite01', {
    capability: 'android23',
    components: ['components/android'],
    include: ['configs/myBrand', 'implementations/set_01', 'implementations/set_02' ],
    config: {
        username: 'patata',
        password: 'patata'
    },
    reports: [
        { 
            package: 'json',
            path: patata.fileUtils.generateResultsFilePath('json')
        }
    ],
    features: {
        files: ['features/set_01', 'features/set_02'],
        tags: ['@tag01,@tag02'], 
        scenarios: ['name01', 'name02']
    },
    provider: {
        path: 'apps/test.apk'
    },
    servers: [{ host: 'localhost', port: 4723, loglevel: 'debug' }]    /* Optional */
});
```

## Run suites

Based on the previous ```patatafile.js``` example, open your terminal and write:

```
patata suite01
```

# Components

Components are one of the powerful features of Patata: split device specific from feature.

E.g. file: ```components/android/ui.js```

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

E.g. file: ```components/ios/ui.js```

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

In these files, we create two components called ```LOGIN_BUTTON``` and ```LEFT_MENU_BUTTON```.

Both files contains the same component names, but the implementation of them are specific for *Android* and *iOS*.

## Components on ```patatafile.js```

We can create multiple files with components in different paths. The *suite* section of the ```patatafile.js``` contains an option to set multiple directory paths and/or files:

```
patata.suite('suite01', {
    
    components: ['components/android'],
    
});
```

You can decide how to split and organize your components files and folders.

# Capabilities (```patatafile.js```)

We can use capabilities in three different ways:

- Capabilily default template from Patata
- Create your custom capability using the [Capabilities Appium documentation](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md)
- Combine both approaches using a template.

## Default Patata Capabilities

| API version | OS Version |
|:- |:-|
| ```ios81``` | ```ios-8.1``` |
| ```ios92``` | ```ios-9.2``` |
| ```android18``` | ```android-4.3``` |
| ```android19``` | ```android-4.4.2``` |
| ```android20xx``` | ```android-4.4W.2``` |
| ```android21``` | ```android-5.0.1``` |
| ```android22``` | ```android-5.1.1``` |
| ```android23``` | ```android-6.0``` |

E.g.: 

```
patata.suite('suite01', {
    
    capabilities: 'android23',
    
});
```

```
patata.suite('suite01', {
    
    capabilities: 'android-6.0',
    
});
```

## Custom Capabilities

Based on the [Capabilities Appium documentation](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md)


```
patata.suite('suite01', {
    
    capabilities: {
        browserName: 'Safari',
        platformName: 'iOS',
        platformVersion: '9.2',
        deviceName: 'iPhone 5s',
        udid: 'XXXXXX'
    },
    
});
```

## Template Capabilities

Use ```template``` attribute to set one of the *Default Patata Capabilities*. Then, use ```append``` to override or append the new values.

```
patata.suite('suite01', {
    
    capabilities:  {
        template: 'ios-9.2',
        append: {
            browserName: 'Safari',
            udid: 'XXXXXX'
        }
    },
    
});
```

# Include (```patatafile.js```)

Set of folders or files where the test implementations are. As well, this can be used to fetch configuration files.

```
patata.suite('suite01', {
    
    include: ['configs/myBrand', 'implementations/set_01', 'implementations/set_02' ],
    
});
```

# Config (```patatafile.js```)

We can bypass an object to our tests from the ```patatafile.js```.

```
patata.suite('suite01', {
    
    config: {
        username: 'patata',
        password: 'patata'
    },
    
});
```

We can use the configuration in two different ways. From the test cases using ```this.config```:

```
this.When('I write enter my credentials', function (value, comp) {
    return this.emu
        .USERNAME_FIELD.setText(this.config.username)
        .PASSWORD_FIELD.setText(this.config.password);
});
```

Or from other files using ```patata```:

```
var patata = require('patata');
var usernameValue = patata.config.username;
var passwordValue = patata.config.password;
```



# Features (```patatafile.js```)

Features can be organized in folders, files, tags or scenarios. Those can be referenced on the ```patatafile.js```.

- ```files```: set of strings that represents relative paths:
    - ```['features/set01', 'features/set02']```: folders and subfolders from those paths.
- ```scenarios```: set of regular expressions by name:
    - ```['topic_a', 'topic_b']```
    - ```['topic_?']```
- ```tags```: using the name of the tags from the tests:
    - ```['@tag1']```: all that contains that tag
    - ```['~@tag2']```: all that does not contain that tag
    - ```['@tag1,@tag2']```: all that contains the first tag OR the second tag.
    - ```['@tag1', '@tag2']```: all that contains the first tag AND the second tag.

```
patata.suite('suite01', {
    
    features: {
        files: ['features/set_01', 'features/set_02'],
        tags: ['@tag01,@tag02'], 
        scenarios: ['name01', 'name02']
    },
    
});
```

More info here about features, scenarios and tags: [CucumberJS](https://github.com/cucumber/cucumber-js)

# Providers (```patatafile.js```)

Providers will help us to fetch the binary file.

By default, it exists one plugin to fetch the file from the file system or HTTP. It can be configured in the following way on the ```patatafile.js```:

```
patata.suite('suite01', {
    
    provider: {
        path: RELATIVE_PATH_TO_FILE
    },
    
});
```


# Reports (```patatafile.js```)

Providers will create a summary of the tests. They have a lot of possibilities, from output on the screen, to a file, CI tools, Slack, ... .

At the moment, it exists one plugin for reports:

- ```json```: which will obtain all information from the tests and save it in a file called ```results.json```.

```
patata.suite('suite01', {
    
    reports: [
        { 
            package: 'json',
            path: patata.fileUtils.generateResultsFilePath('json')
        }
    ],
});
```

# Servers (```patatafile.js```)

Patata creates a new instance of Appium for itself. In this section, you can specify the Appium arguments to use*. 

Example:

```
patata.suite('suite01', {
    
    servers: [{ host: 'localhost', port: 4723, loglevel: 'debug' }],
        
});
```

You can use ```attach``` if you have an already Appium server in background.

```
patata.suite('suite01', {
    
    servers: [{ attach: true, host: 'localhost', port: 4723, loglevel: 'debug' }],
        
});
```

## *Appium arguments

Those can be found on:

<https://github.com/appium/appium/blob/master/lib/parser.js>

For each item, the value, we find the name under the attribute ```dest```:

```
E.g. --log-level should be 'loglevel'

  [['--log-level'], {
    choices: ['info', 'info:debug', 'info:info', 'info:warn', 'info:error',
              'warn', 'warn:debug', 'warn:info', 'warn:warn', 'warn:error',
              'error', 'error:debug', 'error:info', 'error:warn', 'error:error',
              'debug', 'debug:debug', 'debug:info', 'debug:warn', 'debug:error'],
    defaultValue: 'debug',
    dest: 'loglevel',      <=========== THIS ONE (loglevel)
    required: false,
    example: 'debug',
    help: 'log level; default (console[:file]): debug[:debug]',
  }],

```