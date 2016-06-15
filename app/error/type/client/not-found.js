'use strict';

/**
 * Dependencies
 */
let ClientError = require('../client');

/**
 * Constructor
 */
function NotFoundError(message, data) {
  message = message || 'Resource not found';
  ClientError.call(this, message, data, 404);
}

/**
 * Extend prototype
 */
NotFoundError.prototype = Object.create(ClientError.prototype);
NotFoundError.prototype.constructor = NotFoundError;
NotFoundError.prototype.name = 'NotFoundError';
NotFoundError.prototype.code = 'NOT_FOUND';

//Export
module.exports = NotFoundError;
