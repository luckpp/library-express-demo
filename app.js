const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app'); // tell that we are in app
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
// if something is requested from public/css or from public/js and not found than
// look into the mappings below
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));

app.set('views', './src/views'); // set the views directory
app.set('view engine', 'pug'); // set the view engine we will use -> when Express starts to look of what to use it will look for 'pug'

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render('index', {
    title: 'MyLibrary',
    list: ['a', 'b']
  }); // this will render a view called index
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
