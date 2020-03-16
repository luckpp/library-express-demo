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
// ...

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

## 7. Databases

### 7.1. SQL DB

You can use a SQL DB hosted on Microsoft Azure.

### 7.1.1 Create a SQL DB on Microsoft Azure

- go to http://azure.microsoft.com/
  - create a free account

- go to https://portal.azure.com/
  - create a SQL DB:
    - Name: `library-demo`
    - Resource Group: `library-dem-group`
    - Server Name: `library-demo-server`
    - Admin: `library-demo-admin`

- the newly created DB should be available on the Azure portal under Resources

- navigate to `Home -> All resources -> library-demo (library-demo-server/library-demo)`
  - open the `Query editor (preview)`
  - login with `library-demo-admin` user

- create a new query that will add the **books** table
```SQL
CREATE TABLE books (
    title varchar(255),
    author varchar(255)
)
```

- to add additional columns you can create a new query:
```SQL
ALTER TABLE books
    ADD id int;
```

- to populate the **books** table with data create a new query:
```javascript
INSERT INTO books (id, title, author) VALUES
    (0, 'War and Peace', 'Lev Nikolayevich Tolstoy'),
    (1, 'Les Misérables', 'Victor Hugo'),
    (2, 'The Time Machine', 'H. G. Wells'),
    (3, 'A Journey into the Center of the Earth', 'Jules Verne'),
    (4, 'The Dark World', 'Henry Kuttner'),
    (5, 'The Wind in the Willows', 'Kenneth Grahame'),
    (6, 'Life On The Mississippi', 'Mark Twain'),
    (7, 'Childhood', 'Lev Nikolayevich Tolstoy')
```

- to view the data that has been inserted create a new query:
```SQL
SELECT TOP (1000) * FROM [dbo].[books]
```

### 7.1.2 Connect to a SQL DB on Microsoft Azure

- install `mssql` npm package:
  - `npm i mssql`

- connect to SQL DB on Microsoft Azure:

``` javascript
const sql = require('mssql');
// ...

const config = {
  user: 'library-demo-admin',
  password: fs.readFileSync('D:\\Temp\\LIBRARY_DEMO_ADMIN_PASS.txt').toString(),
  server: 'library-demo-server.database.windows.net',
  database: 'library-demo',
  options: {
    encrypt: true // Use this if you are on Windows Azure
  }
};
sql.connect(config).catch(error => {
  debug(`ERROR ${error} - Connection config to ${JSON.stringify(config)}`);
});
```

- explanations for the `config` from the code abowe:
  - the user `library-demo-admin` has been created on previous chapter
  - the server can be found on https://portal.azure.com/
    - **Home -> All resources -> library-demo (library-demo-server/library-demo)**
    - **Overview**

NOTE: It is important to properly set-up the firewall rules on the Azure portal so that clients can connect to the SQL DB. Go to:
  - **Home -> All resources -> library-demo (library-demo-server/library-demo)**
  - **Overview**
  - **Set server firewall**
  - click **Add client IP**
  - click **Save**

- after creating the connection to SQL DB, create a request:
  - go to `bookRoutes.js`
```javascript
const sql = require('mssql');
// ...
bookRouter.route('/')
  .get((req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM books')
      .then(result => {
        console.log(JSON.stringify(result.recordset, null, 2));
        res.render('bookListView', {
          title: 'Library',
          nav,
          books: result.recordset
        });
      });
  });
```

NOTE: the code above is **old style** since we use promisses. In order to refactor you can use an `IIFE` in combination with `async / await`:
```javascript
const sql = require('mssql');
// ...
bookRouter.route('/')
  .get((req, res) => {
    (async function query() {
      const request = new sql.Request();
      const { recordset } = await request.query('SELECT * FROM books');
      res.render('bookListView', {
        title: 'Library',
        nav,
        books: recordset
      });
    }());
  });
```

**NOTE: In `bookRouters` we do not need to connect to the SQL Azure DB since we have already done this in `app.js` and `Node.js` takes care to provide in `bookRouters` the same `mssql` instance as in `app.js` (see Common.js pattern implemented by Node.js require).**

- to query using an **input parameter** it is important to use the functionality offered by `mssql` library:
```javascript
const sql = require('mssql');
// ...
bookRouter.route('/:id')
  .get((req, res) => {
    (async function query() {
      const { id } = req.params;
      const request = new sql.Request();
      const { recordset } = await request
        .input('id', sql.Int, id)
        .query('SELECT * FROM books WHERE id=@id');
      res.render('bookView', {
        title: 'Library',
        nav,
        book: recordset[0]
      });
    }());
  });
```

### 7.2. Middleware

A middleware is a function that is executed on every request that comes in:
```javascript
app.use(function(req, res, next) {
  console.log('my middleware');
  next();
});
```

In `bookRoutes.js` you can add the following middleware to compute the book based in te `id`:
```javascript
bookRouter.route('/:id')
  .all((req, res, next) => {
    (async function query() {
      const { id } = req.params;
      const request = new sql.Request();
      const { recordset } = await request
        .input('id', sql.Int, id)
        .query('SELECT * FROM books WHERE id=@id');
      [req.book] = recordset;
      next();
    }());
  })
  .get((req, res) => {
    res.render('bookView', {
      title: 'Library',
      nav,
      book: req.book
    });
  });
```

### 7.2. MongoDB

MongoDB can be installed locally from https://www.mongodb.com/.

You can use the `mongodb` nom package https://www.npmjs.com/package/mongoose
- `npm i mongodb`

To insert data into a mogo collection folow the steps below:
```javascript
const { MongoClient } = require('mongodb');
// ...
const url = 'mongodb://localhost:27017';
const dbName = 'library-demo';
(async function mongo() {
  let client;
  try {
    client = await MongoClient.connect(url);
    debug('connected correctly to MongoDB');

    const db = client.db(dbName);

    const response = await db.collection('books').insertMany(books);
    res.json(response);
  } catch (error) {
    debug(error.stack);
  }
  client.close();
}());
```

NOTE: The fundamental difference between MongoDB and SQL Server, Oracle or MySQL is that MongoDB will create whatewer it needs (the required **DB** or the required **collection**)

To query for a single document by `_id` use the `ObjectID`:
```javascript
const { MongoClient, ObjectID } = require('mongodb');
// ...
client = await MongoClient.connect(url);
const db = client.db(dbName);
const col = await db.collection('books');
const book = await col.findOne({ _id: new ObjectID(id) });
```

### 8. Authentication

In order to POST (create) data to the server we need to parse the body of the POST request. Use the `body-parser` npm package to do so: `npm i body-parser`:
```javascript
const bodyParser = require('body-parser');
// ...
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

The above middleware will take care of putting the body of the POST request into the `req.body`.
