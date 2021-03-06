'use strict';

/**
 * Dependencies
 */
let multer = require('multer');
let mimeTypesFilter = require('../plugins/multer/mime-types-filter');
let NotFoundError = require('../error/type/client/not-found');
let config = require('../config');

/**
 * Configuration
 */
const API_BASE = config.API_BASE_URL + config.API_BASE_PATH;
const MAX_FILE_SIZE = config.USER_AVATAR_MAX_FILE_SIZE;
const MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

/**
 * Avatar URL generator
 */
function avatarUrl(id, mimeType, timestamp) {
  let ext = mimeType.split('/')[1].toLowerCase().replace('jpeg', 'jpg');
  let url = API_BASE + 'user/' + id + '/avatar.' + ext;
  if (timestamp) {
    url += '?' + String(Math.floor(Date.now() / 1000));
  }
  return url;
}

/**
 * Avatar controller
 */
module.exports = {

  /**
   * Save avatar
   */
  save(req, res, next) {

    //Get user and uploaded file
    let user = req.user;
    let file = req.file;

    user.avatar = {
      url: avatarUrl(user.id, file.mimetype, true),
      data: file.buffer,
      mimeType: file.mimetype
    };

    //Save
    user.save()
      .then(() => {
        res.json({
          avatar: user.avatar.url
        });
      })
      .catch(next);
  },

  /**
   * Delete avatar
   */
  delete(req, res, next) {

    //Get user and reset avatar data
    let user = req.user;
    user.avatar = null;

    //Save
    user.save()
      .then(() => {
        res.status(200).send();
      })
      .catch(next);
  },

  /**
   * Stream avatar
   */
  stream(req, res, next) {

    //Get user
    let user = req.user;

    //If no user or no avatar, send 404
    if (!user || !user.avatar || !user.avatar.data) {
      return next(new NotFoundError());
    }

    //Set content type and send data
    res.contentType(user.avatar.mimeType);
    res.send(user.avatar.data);
  },

  /**************************************************************************
   * Middleware
   ***/

  /**
   * Upload middleware
   */
  upload(req, res, next) {

    //Create upload middleware
    let upload = multer({
      storage: multer.memoryStorage(),
      fileFilter: mimeTypesFilter(MIME_TYPES),
      limits: {
        fileSize: MAX_FILE_SIZE
      }
    }).single('avatar');

    //Use middleware
    upload(req, res, next);
  }
};
