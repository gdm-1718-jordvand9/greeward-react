const async = require('async');

const Activity = require('../models/activity');
const errorHandler = require('../utilities/errorHandler');


exports.like_create_post = function (req, res, next) {
  const id = req.params.activityId;
  Activity.findById(id, (err, activity) => {
    if (!activity) {
      res.status(404).json('User heeft geen volgers');
    }
    if (activity) {
      const isInArray = activity.likes.some((like) => {
        return like.equals(req.userId);
      });
      if (isInArray) {
        return errorHandler.handleAPIError(500, `Already liked a post with id: ${id}`, next);
      }
      if (!isInArray) {
        Activity.findByIdAndUpdate(id, {
          $push: { likes: req.userId }
        }, { new: true }).then(activity => {
          if (!activity) {
            return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
          }
          res.status(201).json(req.userId);
        }).catch(err => {
          if (err.kind === 'ObjectId') {
            return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
          }
          return errorHandler.handleAPIError(500, `Could not update activity with id: ${id}`, next);
        });
      }
    }
  });
}
exports.like_remove_post = function (req, res, next) {
  const id = req.params.activityId;
  Activity.findByIdAndUpdate(id, {
    $pull: { likes: req.userId }
  }, { new: true }).then(activity => {
    if (!activity) {
      return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
    }
    res.status(201).json(req.userId);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
    }
    return errorHandler.handleAPIError(500, `Could not update activity with id: ${id}`, next);
  });
}