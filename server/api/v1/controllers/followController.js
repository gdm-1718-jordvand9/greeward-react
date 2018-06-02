const async = require('async');


const Follower = require('../models/follower');
const Following = require('../models/following');
const errorHandler = require('../utilities/errorHandler');

exports.get_following = function (req, res, next) {
  const id = req.params.id;
  const query = Following.findOne({ _uid: id }).populate('_fid', 'first_name last_name avatar').select('_fid');
  query.exec((err, following) => {
    if (err) return errorHandler.handleAPIError(500, `Could not get the users followings with id: ${id}`, next);
    if (!following) {
      return errorHandler.handleAPIError(404, `Following not found with id: ${id}`, next);
    }
    return res.json(following);
  });
}
exports.get_followers = function (req, res, next) {
  const id = req.params.id;
  const query = Following.find({ _fid: id }).populate('_uid', 'first_name last_name avatar').select('_uid -_id ');
  query.exec((err, followers) => {
    if (err) return errorHandler.handleAPIError(500, `Could not get the users followers with id: ${id}`, next);
    if (!followers) {
      return errorHandler.handleAPIError(404, `Followers not found for user with id: ${id}`, next);
    }
    return res.json(followers);
  });
}
// Find out wheter or not the userId already exists in the follower table
// If it doesn't, create a new follower 
// If it does, check wheter or not the ObjectId is in the array already
// If ObjectId is not in the array, push it
// If ObjectId is in the array, send back a message, user already followed.
exports.follow_create_post = function (req, res, next) {
  if (!req.body || !req.body._fid) {
    return errorHandler.handleAPIError(400, `Post must have a _fid`, next);
  }
  Following.findOne({ _uid: req.userId }, (err, following) => {
    if (err) return errorHandler.handleAPIError(500, `Could not find any following record`, next);
    if (!following) {
      const newFollowing = new Following({
        _uid: req.userId
      });
      newFollowing.save((err, savedFollowing) => {
        if (err) return errorHandler.handleAPIError(500, `Could not save new following record`, next);
        Following.findByIdAndUpdate(savedFollowing, {
          $push: { _fid: req.body._fid }
        }, { new: true }).then(updatedFollowing => {
          if (!updatedFollowing) {
            return errorHandler.handleAPIError(404, `Following not found with id: ${savedFollowing._id}`, next);
          }
          res.status(201).json(updatedFollowing);
        }).catch(err => {
          if (err.kind === 'ObjectId') {
            return errorHandler.handleAPIError(404, `Following not found with id: ${savedFollowing._id}`, next);
          }
          return errorHandler.handleAPIError(500, `Could not update following with id: ${savedFollowing._id}`, next);
        });
      })
    }
    if (following) {
      const followingExists = following._fid.some((following) => {
        return following.equals(req.body._fid);
      });
      if (!followingExists) {
        Following.findByIdAndUpdate(following, {
          $push: { _fid: req.body._fid }
        }, { new: true }).then(updatedFollowing => {
          if (!updatedFollowing) {
            return errorHandler.handleAPIError(404, `Following not found with id: ${following._id}`, next);
          }
          res.status(201).json(updatedFollowing);
        })
          .catch(err => {
            if (err.kind === 'ObjectId') {
              return errorHandler.handleAPIError(404, `Following not found with id: ${following._id}`, next);
            }
            return errorHandler.handleAPIError(500, `Could not update following with id: ${following._id}`, next);
          })
      }
      if (followingExists) {
        return errorHandler.handleAPIError(500, `Already following user.`, next);
      }
    }
  });
}

exports.is_following = function (req, res, next) {
  const id = req.params.id;
  Following.findOne({ _uid: req.userId }, (err, following) => {
    if (!following) {
      res.status(404).json('User heeft geen volgers');
    }
    if (following) {
      const isInArray = following._fid.some((check) => {
        return check.equals(id);
      });
      if (!isInArray) {
        res.status(404).json({ follow: false });
      }
      if (isInArray) {
        res.status(201).json({ follow: true });
      }
    }
  });
};

exports.unfollow_post = function (req, res, next) {
  const id = req.params.id
  Following.findOneAndUpdate({ _uid: req.userId }, {
    $pull: { _fid: id }
  }, { new: true }).then(updatedFollowing => {
    if (!updatedFollowing) {
      return errorHandler.handleAPIError(404, `Following not found with id: ${id}`, next);
    }
    res.status(201).json(updatedFollowing);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return errorHandler.handleAPIError(404, `Following not found with id: ${id}`, next);
    }
    return errorHandler.handleAPIError(500, `Could not update following with id: ${id}`, next);
  });
}