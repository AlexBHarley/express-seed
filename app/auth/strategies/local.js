'use strict';

/**
 * Dependencies
 */
let passport = require('passport');
let mongoose = require('mongoose');
let LocalStrategy = require('passport-local').Strategy;
let User = mongoose.model('User');

/**
 * Local strategy
 */
module.exports = function() {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, cb) => {

    //Find user by email
    User.findByEmailAndPopulate(email)
      .then(user => {
        if (!user) {
          return cb(null, false);
        }

        //Compare user's password
        user.comparePassword(password, (error, isMatch) => {
          if (error) {
            return cb(error);
          }
          if (!isMatch) {
            return cb(null, false);
          }
          return cb(null, user);
        });
      })
      .catch(cb);
  }));
};
