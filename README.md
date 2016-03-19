## Hi developer

Welcome to Patata! Let's write a little bit about how this project is structured so we can collaborate on it!

Firstly, remember to create a branch for any change you do and create a pull request. It will be revised as soon as possible.

## What do you need (Unix)

- Download and install [NodeJS](https://nodejs.org/en/download/)
- Open a terminal and be sure you have access to the following commands: <code>node</code> and <code>npm</code>
- Download [Genymotion](https://www.genymotion.com/) or your favorite emulator. You can use your own physical device too.
- Use your favorite web IDE, but I recommend you to use [Visual Studio Code](https://code.visualstudio.com/#alt-downloads), which is mainly used and tested for this project and it supports Mac, Linux and Windows.

## The package.json

You can find more information about how this file works under [Using a package.json](https://docs.npmjs.com/getting-started/using-a-package.json).

## Patata files

The main file is under /lib/patata.js.

Patata class is partial, which means that it is a class divided in different files, that act as plugins.

### Extend the class

Plugins are loaded automatically.

Create a file with the name <code>lib/patata/extensions/patata-NAME.js</code> and paste the following content:

```
"use strict";

module.exports = function(Patata, patata) {
    if (!Patata) return;
             

}
```

If you want to extend the class with methods, you can use a syntax like this:

```
"use strict";

module.exports = function(Patata, patata) {
    if (!Patata) return;
             
    Patata.prototype.myMethod = function() {
    
        return this;   
    }
}
```

If the method does not need to return anything, like <code>void</code> in other languages, then it is a good approach to return <code>this</code> so it is possible to chain the calls.

