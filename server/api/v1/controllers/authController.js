const passport = require('passport');

const User = require('../models/user');
const Following = require('../models/following');
const errorHandler = require('../utilities/errorHandler');
const tokenUtils = require('../utilities/token');
const config = require('../../../config/config');


exports.user_create_post = function (req, res, next) {
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, post) => {
    if (err) return next(err);
    res.status(201).json(user);
    const following = new Following({
      _uid: user._id,
      _fid: [],
    });
  });
}

exports.user_auth_local_post = function (req, res, next) {
  passport.authenticate('local', config.jwtSession, function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({
        'message': 'User Not Authenticated'
      });
    }
    req.auth = {
      id: user.id
    };
    const token = tokenUtils.createToken(req.auth);
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        stats: user.stats
      },
      token: `${token}`,
      strategy: 'local'
    });
  })(req, res, next);
}

exports.user_auth_facebook_post = function (req, res, next) {
  passport.authenticate('facebook-token', config.jwtSession, function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({
        'message': 'User Not Authenticated'
      });
    }
    req.auth = {
      id: user.id
    };
    const token = tokenUtils.createToken(req.auth);
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        stats: user.stats,
      },
      token: `${token}`,
      strategy: 'facebook-token'
    });
  })(req, res, next);
}

