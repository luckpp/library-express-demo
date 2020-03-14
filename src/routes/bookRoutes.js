const express = require('express');
const sql = require('mssql');

const bookRouter = express.Router();

function router(nav) {
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

  return bookRouter;
}

module.exports = router;
