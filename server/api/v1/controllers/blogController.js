const Blog = require('../models/blog');
const errorHandler = require('../utilities/errorHandler');

exports.get_blogs = function(req, res, next) {
  const query = Blog.find().populate('posts');
  query.sort( { created_at: -1 } );
  query.exec((err, blogs) => {
    if (err) return next(err);
    if (blogs == null) {
      return errorHandler.handleAPIError(`Blogs not found!`, next);
    }
    return res.json(blogs);
  });
}

exports.get_blog = function(req, res, next) {
  const id = req.params.id;
  const query = Blog.findById(id).populate('posts');
  query.exec((err, blog) => {
    if (err) return next(err);
    if (blog == null) {
      return errorHandler.handleAPIError(`Blog not found with id: ${id}`, next);
    }
    return res.json(blog);
  });
}