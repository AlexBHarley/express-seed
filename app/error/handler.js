'use strict';

/**
 * This is a wrapper function to send an error through the basic error
 * handlers, e.g. normalize, log and/or store. This should *not* be used as
 * error handling middleware, but rather in cases where you want to capture
 * an error, yet don't want it to break the response. By using this handler,
 * you avoid silent errors that go unnoticed. Req can be used to extract info
 * from the request.
 */

//Create error middleware stack
let config = require('../config');
let stack = config.ERROR_MIDDLEWARE
  .map(handler => require('./middleware/' + handler));

//Export handler
module.exports = function(error, req) {

  //No error handlers?
  if (stack.length === 0) {
    return;
  }

  //Create next handler
  let i = 0;
  let next = function(error) {
    if (stack[i] && typeof stack[i] === 'function') {
      stack[i++](error, req, null, next);
    }
  };

  //Call first middleware
  next(error);
};
