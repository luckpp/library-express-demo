const passport = require('passport');

function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
    // the error is 'null' -> in Node.js we do the error first
    // currently we store the entire user in the session
    // most of the times we want to store only pieces of user in the session (like user.id)
  });

  // Retrieves user from session
  passport.deserializeUser((user, done) => {
    // if in the serialize user we would have passed the user.id
    // here in deserialize we would have received if (userId, done) => { ... }
    done(null, user);
  });

  require('./strategies/local.strategy');
}

module.exports = passportConfig;
