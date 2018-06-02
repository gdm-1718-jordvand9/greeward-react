const async = require('async');

const Activity = require('../models/activity');
const Comment = require('../models/comment');
const User = require('../models/user');
const errorHandler = require('../utilities/errorHandler');


exports.comment_create_post = function (req, res, next) {
  if (!req.body || !req.body.body) {
    return errorHandler.handleAPIError(400, `Comment must have a body`, next);
  }
  // Get the activity
  const id = req.params.activityId;
  // Create new comment
  const comment = new Comment({
    _user: req.userId,
    _activity: id,
    body: req.body.body,
  });
  comment.save((err, comment) => {
    if (err) return errorHandler.handleAPIError(500, `Could not save the new comment`, next);
    // Find activity and update comments
    Activity.findByIdAndUpdate(id, {
      $push: { comments: comment }
    }, { new: true })
      .then(activity => {
        if (!activity) {
          return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
        }
        //res.send(activity);
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
        }
        return errorHandler.handleAPIError(500, `Could not update activity with id: ${id}`, next);
      });
      const query = Comment.findById(comment._id).populate({path: '_user'});
      query.exec((err, com) => {
        res.status(201).json(com);
      });
  });
}

/*
Soft-delete a comment
*/
exports.comment_softdelete_patch = function(req, res, next) {
  const id = req.params.commentId;

  Comment.findByIdAndUpdate(id, {
    deleted_at: Date.now()
  }, {new: true})
    .then(comment => {
      if(!comment) {
        return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);
      }
      res.send(comment);
    }).catch(err => {
      console.log(err);
      if(err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);            
      }
      return errorHandler.handleAPIError(500, `Could not soft-delete comment with id: ${id}`, next);
    });
}

/*
Soft-undelete a post
*/
exports.comment_softundelete_patch = function(req, res, next) {
  const id = req.params.commentId;
  Comment.findByIdAndUpdate(id, {
    deleted_at: null
  }, {new: true})
    .then(comment => {
      if(!comment) {
        return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);
      }
      res.send(comment);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);            
      }
      return errorHandler.handleAPIError(500, `Could not soft-undelete comment with id: ${id}`, next);
    });
}

exports.backoffice_get_comments = function (req, res, next) {
  const query = Comment.find().populate({ path: '_user', model: User });
  query.sort({ created_at: -1 });
  query.exec((err, comments) => {
    if (err) return errorHandler.handleAPIError(500, err.message || 'Some error occurred while retrieving comments', next);
    if (!comments) {
      return errorHandler.handleAPIError(404, `Comments not found`, next);
    }
    return res.json(comments);
  });
}

exports.backoffice_get_comment = function (req, res, next) {
  const id = req.params.commentId;
  const query = Comment.findById(id).populate('_user');
  query.exec((err, comment) => {
    if (err) return errorHandler.handleAPIError(500, `Could not get the comment with id: ${id}`, next);
    if (!comment) {
      return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);
    }
    return res.json(comment);
  });
}

exports.backoffice_get_profile_comments = function (req, res, next) {
  const id = req.params.profileId;
  const query = Comment.find({_user: id});
  query.sort({ created_at: -1 });
  query.exec((err, comments) => {
    if (err) return errorHandler.handleAPIError(500, err.message || 'Some error occurred while retrieving comments', next);
    if (!comments) {
      return errorHandler.handleAPIError(404, `Comments not found`, next);
    }
    return res.json(comments);
  });
}

/*
Delete a Comment
*/
exports.comment_delete_delete = function (req, res, next) {
  const id = req.params.commentId;
  Comment.findByIdAndRemove(id)
    .then(comment => {
      if (!comment) {
        return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);
      }
      res.status(200).json({ action: 'DELETE', message: `Comment with id: ${id} deleted successfully!` });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return errorHandler.handleAPIError(404, `Comment not found with id: ${id}`, next);
      }
      return errorHandler.handleAPIError(500, `Could not delete comment with id: ${id}`, next);
    });
}