# Patata

Framework for easy and quick testing mobile applications using BDD.

Currently it is beta stage and some planned features are not available.

# Install it

```
#!bash
npm install -g patata-cli
npm install --save patata
```

# Folder structure

Folder structure will follow the best practices, but currently, this folder structure may be enought to help you out to start working with Patata:

```
+ features
- patatafile.js
```

# Patatafile.js (quick guide)

The *patatafile.js* is a special file that will help us to include our suites and configurations. This file is used by the *patata-cli*.

```
#!javascript
"use strict";

var patata = require('patata');

patata.suite('suite01', {
    capability: 'android19',
    provider: {
        path: process.cwd() + '/bin/myapp.apk'
    },
    servers: [{ host: 'localhost', port: 4723 }]
});
```

## Suite options

- ***capability***: device API
    - *ios81* || *android18* || *android19*
- ***provider***: how to obtain the binary to test.
    - ***id***: id of the provider to use. This is plugin based and more plugins will be available on NPM. If null or empty, it will use the default one that fetch the file from the file system.
    - Different Options: each provider may contain different options. It is needed to check the documentation of each one.
      - The default provider uses ***path*** which is the absolute binary path.
- ***servers***: destinations for *Appium*. It needs ***hosts*** and ***port***.

# Run suites

Based on the previous *patatafile.js* example, open your terminal and write:

```
patata suite01
```