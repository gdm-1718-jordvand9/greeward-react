const async = require('async');

const Post = require('../models/post');
const Category = require('../models/category');
const errorHandler = require('../utilities/errorHandler');

/*
Get all posts
*/
exports.get_posts = function(req, res, next) {
  const query = Post.find().populate('_category').populate('blogs');
  query.sort( { created_at: -1 } );
  query.exec((err, posts) => {
    if (err) return errorHandler.handleAPIError(500, err.message || 'Some error occurred while retrieving posts', next);
    if (!posts) {
      return errorHandler.handleAPIError(404, `Posts not found`, next);
    }
    return res.json(posts);
  });
}

/*
Get a certain post
*/
exports.get_post = function(req, res, next) {
  const id = req.params.postId;
  const query = Post.findById(id).populate('_category').populate('blogs');
  query.exec((err, post) => {
    if (err) return errorHandler.handleAPIError(500, `Could not get the post with id: ${id}`, next);
    if (!post) {
      return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
    }
    return res.json(post);
  });
}

/*
Create a Post
*/
exports.post_create_get = function(req, res, next) {
  async.parallel({
    categories: function(callback) {
      Category.find(callback).sort( { created_at: -1} );
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.json( { title: 'Create Post', categories: results.categories });
  });
}

exports.post_create_post = function(req, res, next) {
  if(!req.body || !req.body.title || !req.body.synopsis || !req.body.body || !req.body._category) {
    return errorHandler.handleAPIError(400, `Post must have a title, synopsis, body and _category`, next);
  }

  const post = new Post(req.body);
  post.save((err, post) => {
    if (err) return errorHandler.handleAPIError(500, `Could not save the new post`, next);
    res.status(201).json(post);
  });
}

/*
Update a Post
*/
exports.post_update_get = function(req, res, next) {
  async.parallel({
    post: function(callback) {
      const id = req.params.postId;
      Post.findById(id, callback).populate('_category');
    },
    categories: function(callback) {
      Category.find(callback).sort( { created_at: -1} );
    },
  }, function(err, results) {
    if (err) { return next(err); }
    res.json( { post: results.post, categories: results.categories });
  });
}

exports.post_update_put = function(req, res, next) {
  if(!req.body || !req.body.title || !req.body.synopsis || !req.body.body || !req.body._category) {
    return errorHandler.handleAPIError(400, `Post must have a title, synopsis, body and _category`, next);
  }

  const id = req.params.postId;

  Post.findByIdAndUpdate(id, {
    title: req.body.title,
    synopsis: req.body.synopsis,
    body: req.body.body,
    _category: req.body._category,
  }, {new: true})
    .then(post => {
      if(!post) {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
      }
      res.send(post);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);            
      }
      return errorHandler.handleAPIError(500, `Could not update post with id: ${id}`, next);
    });
}

/*
Delete a Post
*/
exports.post_delete_delete = function(req, res, next) {
  const id = req.params.postId;
  Post.findByIdAndRemove(id)
    .then(post => {
      if(!post) {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
      }
      res.status(200).json({action: 'DELETE', message: `Post width id: ${id} deleted successfully!`});
    }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);               
      }
      return errorHandler.handleAPIError(500, `Could not delete post with id: ${id}`, next);
    });
}

/*
Soft-delete a post
*/
exports.post_softdelete_patch = function(req, res, next) {
  const id = req.params.postId;

  Post.findByIdAndUpdate(id, {
    deleted_at: Date.now()
  }, {new: true})
    .then(post => {
      if(!post) {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
      }
      res.send(post);
    }).catch(err => {
      console.log(err);
      if(err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);            
      }
      return errorHandler.handleAPIError(500, `Could not soft-delete post with id: ${id}`, next);
    });
}

/*
Soft-undelete a post
*/
exports.post_softundelete_patch = function(req, res, next) {
  const id = req.params.postId;

  Post.findByIdAndUpdate(id, {
    deleted_at: null
  }, {new: true})
    .then(post => {
      if(!post) {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
      }
      res.send(post);
    }).catch(err => {
      if(err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);            
      }
      return errorHandler.handleAPIError(500, `Could not soft-undelete post with id: ${id}`, next);
    });
}