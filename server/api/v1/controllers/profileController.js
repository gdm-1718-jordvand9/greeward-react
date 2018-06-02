const errorHandler = require('../utilities/errorHandler');
const User = require('../models/user');

exports.get_profile = function (req, res, next) {
  const id = req.params.id;
  const query = User.findById(id).populate({ path: 'activities', populate: { path: '_user' }, options: { sort: { created_at: -1 } } });
  query.exec((err, profile) => {
    if (err) return next(err);
    if (profile == null) {
      return errorHandler.handleAPIError(`Profile not found with id: ${id}`, next);
    }
    return res.json(profile);
  });
}

exports.backoffice_get_profiles = function (req, res, next) {
  const query = User.find();
  query.sort({ created_at: -1 });
  query.exec((err, users) => {
    if (err) return errorHandler.handleAPIError(500, err.message || 'Some error occurred while retrieving users', next);
    if (!users) {
      return errorHandler.handleAPIError(404, `Users not found`, next);
    }
    return res.json(users);
  });
}
exports.backoffice_get_profile = function (req, res, next) {
  const id = req.params.profileId;
  const query = User.findById(id).populate({ path: 'activities' });
  query.exec((err, profile) => {
    if (err) return next(err);
    if (profile == null) {
      return errorHandler.handleAPIError(`Profile not found with id: ${id}`, next);
    }
    return res.json(profile);
  });
}

exports.profile_delete_delete = function (req, res, next) {
  const id = req.params.profileId;
  User.findByIdAndRemove(id)
    .then(user => {
      if (!user) {
        return errorHandler.handleAPIError(404, `User not found with id: ${id}`, next);
      }
      //Calling remove once again for cascade removing of a user.
      user.remove();
      res.status(200).json({ action: 'DELETE', message: `User with id: ${id} deleted successfully!` });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return errorHandler.handleAPIError(404, `User not found with id: ${id}`, next);
      }
      return errorHandler.handleAPIError(500, `Could not user activity with id: ${id}`, next);
    });
}
