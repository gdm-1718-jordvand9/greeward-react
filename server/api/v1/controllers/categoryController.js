const Category = require('../models/category');
const errorHandler = require('../utilities/errorHandler');

exports.get_categories = function(req, res, next) {
  const query = Category.find().populate('posts');
  query.sort( { created_at: -1 } );
  query.exec((err, categories) => {
    if (err) return next(err);
    if (categories == null) {
      return errorHandler.handleAPIError(`Categories not found!`, next);
    }
    return res.json(categories);
  });
}

exports.get_category = function(req, res, next) {
  const id = req.params.id;
  const query = Category.findById(id).populate('posts');
  query.exec((err, category) => {
    if (err) return next(err);
    if (category == null) {
      return errorHandler.handleAPIError(`Category not found with id: ${id}`, next);
    }
    return res.json(category);
  });
}