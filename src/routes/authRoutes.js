const express = require('express');
const { MongoClinet } = require('mongodb');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      debug(JSON.stringify(req.body));
      res.json(req.body);
    });
  return authRouter;
}

module.exports = router;
