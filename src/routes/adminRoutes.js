const express = require('express');
const debug = require('debug')('app:adminRoutes');
const { MongoClient } = require('mongodb');
const booksMock = require('../data/booksMock');

const adminRouter = express.Router();

const books = booksMock
  .createBooks()
  .map(book => {
    const bookCopy = { ...book };
    delete bookCopy.id;
    return bookCopy;
  });

function router() {
  adminRouter.route('/')
    .get((req, res) => {
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
    });
  return adminRouter;
}

module.exports = router;
