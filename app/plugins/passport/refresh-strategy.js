'use strict';

/**
 * Dependencies
 */
let util = require('util');
let Strategy = require('passport-strategy');

/**
 * Define refresh token strategy
 */
function RefreshStrategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  Strategy.call(this);
  this.name = 'refresh';
  this._verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(RefreshStrategy, Strategy);

/**
 * Authenticate request based on refresh token in http only cookie
 */
RefreshStrategy.prototype.authenticate = function(req) {

  //Initialize vars
  let refreshToken;

  //Get refresh token from cookies
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }

  //Call verify handler
  this._verify(refreshToken, (error, user, info) => {
    if (error) {
      return this.error(error);
    }
    if (!user) {
      info = info || {};
      return this.fail('invalid_token', info);
    }
    this.success(user, info);
  });
};

/**
 * Expose strategy
 */
module.exports = RefreshStrategy;
