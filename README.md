# Llibrary Express Demo API

Demo based on Pluralsight course https://app.pluralsight.com/library/courses/nodejs-express-web-applications-update/table-of-contents.

## 1. npm settings

In order to cinfigure `npm` modify the `.npmrc` file stored on your computer. See more info:
- https://docs.npmjs.com/configuring-npm/npmrc.html
- https://docs.npmjs.com/cli/config

NOTE: The `.npmrc` si sored in the following location:
- on Windows: **C:\\Users\\{user_name}\\.npmrc**
- on Linux: **~/.npmrc**

Recommended values:
```javascript
progress=false // if true will show progress when installing a new package
save=true // if false will not be saved in package.json
save-exact=true // if false than in package.json the package version will contain a ^
```

In order to set the values above one should use the command line (not change the `.npmrc` manually):
```bash
$ npm config set save=true
$ npm config set save-exact=true
```

## 2. Debug

In order to properly do debugging the following npm packages are required:

### 2.1. `chalk`
```javascript
var chalk = require('chalk');
console.log(`listening on port ${chalk.green(3000)}`);
```

### 2.2. `debug`
```javascript
var debug = require('debug')('app'); // tell that we are in app
debug(`listening on port ${chalk.green(3000)}`);
```
If we run the code above with `node app.js` we ge no output to the console!

The difference between `debug(...)` and `cosole.log(...)` is that the `debug` runs only when you are in debug mode. So if you are in production and you use debug is not going to print to the console.

In order to get DEBUG messages do the following:
```bash
# on Windows
$ set DEBUG=* & node app.js
# on Linux
$ DEBUG=* node app.js
```

=> You will get DEBUG messages from other packages too. This can become a little bit wordy so you can change that:
```bash
# on Windows
$ set DEBUG=app & node app.js
# on Linux
$ DEBUG=app node app.js
```
=> You will get only the messages for **app**.

NOTE: the settings above could be done also in `package.json` as part of the `npm scripts`:
```javascript
"scripts": {
    "start-debug": "set DEBUG=* & node app.js"
}
```

### 2.3. `morgan`

In order to log information related to web traffic**morgan**: `npm i morgan` ().

```javascript
var morgan = require('morgan');

app.use(morgan('combined'));
// or
app.use(morgan('tiny'));
```

