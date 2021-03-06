const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

db.connect();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library-demo' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' }
];
const bookRouter = process.env.DB === 'sql'
  ? require('./src/routes/bookRoutesSql')(nav)
  : require('./src/routes/bookRoutesMongo')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

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
  app.use('/admin', adminRouter);
  app.use('/auth', authRouter);

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
