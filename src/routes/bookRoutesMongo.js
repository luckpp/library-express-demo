const express = require('express');
const debug = require('debug')('app:bookRoutesMongo');
const { MongoClient, ObjectID } = require('mongodb');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'library-demo';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected correctly to MongoDB');

          const db = client.db(dbName);
          const col = await db.collection('books');
          const books = await col.find().toArray();

          res.render('bookListViewMongo', {
            title: 'Library',
            nav,
            books
          });
        } catch (error) {
          debug(error.stack);
        }
        client.close();
      }());
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'library-demo';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connected correctly to MongoDB');

          const db = client.db(dbName);
          const col = await db.collection('books');
          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);

          res.render('bookView', {
            title: 'Library',
            nav,
            book
          });
        } catch (error) {
          debug(error.stack);
        }
      }());
    });

  return bookRouter;
}

module.exports = router;
