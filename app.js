const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

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

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);

const templatingEngine = process.env.TEMPLATING_ENGINE;
if (templatingEngine === 'static') {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
} else if (templatingEngine === 'pug') {
  app.set('views', './src/views');
  app.set('view engine', 'pug');
  app.get('/', (req, res) => {
    res.render('index', {
      title: 'MyLibrary',
      list: ['a', 'b']
    });
  });
} else if (templatingEngine === 'ejs') {
  app.set('views', './src/views');
  app.set('view engine', 'ejs');

  app.use('/books', bookRouter);

  app.get('/', (req, res) => {
    res.render('index', {
      title: 'Library',
      nav
    });
  });
}

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
