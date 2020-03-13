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

## 3. Project structure

### 3.1. Static files - public directory

Create a `public` folder in the project root and set-up **express** to serve static files from this folder:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

Copy all dependencies in `public` folder (for the moment the dependencies are `boostrap` and `jquery` and `propper.js`). For more info check https://getbootstrap.com/docs/4.4/getting-started/download/#bootstrapcdn.

Also update the `index.html` with all dependencies:
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <div class="jumbotron">
            Serving up HTML
        </div>
    </div>
    <script src="js/jquery.slim.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
</body>
</html>
```

The drawback for the approach above is that we can not do an `npm undate` and get automatically all updates in the `public` directory.

### 3.1. Static files - node_modules
Remove all the dependencies from `public` added manually.

Create the mapings using `express.static` to the dependencies from `node_modules`:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
// if something is requested from public/css or from public/js and not found than look into the mappings below
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));
```

## 4. Tooling

### 4.1. ESLint

```bash
$ npm i eslint --save-dev
$ npx eslint --init
$ npx eslint **/*.js
```

In order to integrate **ESLint** with **Visual Studio Code** add the following plug-in:
- **ESLint** created by **Dirk Baeumer**


### 4.2. The Node.js versions

Check the JavaScript features available to each Node version on https://node.green/.

### 4.3. Refactoring

Below you can find a list of shorcuts that can help refactoring the code:

1. Select text & CTRL + F2
    - select text
        - this will light up all similar text portions in editor
    - CTRL + F2
        - this will allow refactoring the lighted up text

2. SHIFT + ALT + F
    - or inside the text editor **right-click -> Format Document**
        - this will format the entire document

3. Shortcuts on the bottom editor tab. Example:
    - **Go to Line**
    - **Select Indentation**
    - **Select Encoding**
    - **Select End of Line Sequence**
    - **Select Language Mode**
    - ...

4. `eslint **/*.js --fix`
    - will potentially fix linting errors and warnings

### 4.4. Setting up Nodemon

**Nodemon** reloads your application:
- monitors your application
- when you make code changes it's going to automatically restart your application
- more info on https://nodemon.io/
- it allows also to set environment variables
- you can configure it inside `package.json`:
```javascript
{
    "nodemonConfig": {
        "restartable": "rs", // comand that will trigger resrart
        "ignore": [ // changes to ignore
            "node_modules/**/node_modules"
        ],
        "delay": "2500", // restart after this delay in milliseconds
        "env": { // environment variables
            "DEBUG": "app",
            "NODE_ENV": "development",
            "PORT": "3000"
        }
    }
}
```
NOTE: The environment variables can be accessed through `process.env` object.

## 5. Templating engine

A templating engine is a technology that can be used by `express` to dinamically generate HTML and serve it to the browser.

### 5.1. Pug

In order to start using **Pug** do the following setps:

- `npm i pug`

- create the folder 'src\views'
  - add the `index.pug` file:

```pug
html
  head
    title MyApp
  body(class=['myClass'])
    h1(id='myId')= title
    p
      h3 sub header
      ul
        each val in list
          li=val
```

- update the **app.js** with the following code:

```javascript
app.set('views', './src/views'); // set the views directory
app.set('view engine', 'pug'); // set the view engine we will use -> when Express starts to look of what to use it will look for 'pug'

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render('index', {
    title: 'MyLibrary',
    list: ['a', 'b']
  }); // this will render a view called index
});
```

### 5.2. EJS

In order to start using **EJS** do the following setps:

- `npm i ejs`

- create the folder 'src\views'
  - add the `index.ejs` file:

```ejs
<html>
<head>
</head>
<body>
  <h1>
    Welcome to <%=title%>
  </h1>
  <ul>
    <% for(var i=0; i<list.length; i++) { %>
    <li><%=list[i]%></li>
    <% } %>
  </ul>
</body>
</html>
```

- update the **app.js** with the following code:

```javascript
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Library',
    list: ['a', 'b']
  });
});
```

NOTE:
- You can install Visual Studio Code EJS support by adding the following extension: **EJS language support** created by **DigitalBrainstem**
- **We use in this demo a templating engine only to keep things simple and focus on Node.js and Express**

### 5.3. Templates

When starting a new project it is better not to start from scratch. So it is recommended to use a predefined template:
- go to https://www.bootstrapzero.com/l to get a free template

## 6. Routing

A `router` allows you to encapsulate all of your routes in one place:

```javascript
const bookRouter = express.Router();
//...

bookRouter.route('/books')
  .get((req, res) => {
    res.send('hello books');
  });
app.use('/', bookRouter);

// OR

bookRouter.route('/')
  .get((req, res) => {
    res.send('hello books');
  });
bookRouter.route('/single')
  .get((req, res) => {
    res.send('hello single book');
  });
app.use('/books', bookRouter); // to make it clear
```
