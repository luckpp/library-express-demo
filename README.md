# Llibrary Express Demo API

Demo based on Pluralsight course https://app.pluralsight.com/library/courses/nodejs-express-web-applications-update/table-of-contents.

Modify the npm settings

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
