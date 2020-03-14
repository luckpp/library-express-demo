const express = require('express');
const sql = require('mssql');
const { createBooks } = require('../data/booksMock');

const bookRouter = express.Router();

function router(nav) {
  const books = createBooks();

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM books');
        res.render('bookListView', {
          title: 'Library',
          nav,
          books: result.recordset
        });
      }());
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
