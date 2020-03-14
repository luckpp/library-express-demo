const express = require('express');
const sql = require('mssql');
const { createBooks } = require('../data/booksMock');

const bookRouter = express.Router();

function router(nav) {
  const books = createBooks();

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

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      res.render('bookView', {
        title: 'Library',
        nav,
        book: books[id]
      });
    });

  return bookRouter;
}

module.exports = router;
