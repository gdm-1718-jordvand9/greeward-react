/* global google */
//const async = require('async');

const Activity = require('../models/activity');
const Comment = require('../models/comment');
const User = require('../models/user');
const errorHandler = require('../utilities/errorHandler');

/*
Google Maps
*/
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAMFOXgK0rg2MC_Kx5vrDhInQ2GEa5YVVM',
  Promise: Promise
});
/*
Get all activities
*/
exports.get_activities = function (req, res, next) {
  /*googleMapsClient.distanceMatrix({
    origins: {lat: 51.05341567143143, lng: 3.7180641392575655},
    destinations: { lat: 51.04723698244587, lng: 3.721773542946704},
    mode: 'bicycling',
  })
  .asPromise()
  .then((response) => {
    console.log(JSON.stringify(response));
    console.log(response.json.rows[0].elements[0].distance.value);
  })
  .catch((err) => {
    console.log(err);
  });*/
  const query = Activity.find({deleted_at: null}).populate({ path: '_user', model: User, match: { deleted_at: { $exists: false } } });
  query.sort({ created_at: -1 });
  query.exec((err, activities) => {
    if (err) return errorHandler.handleAPIError(500, err.message || 'Some error occurred while retrieving activities', next);
    if (!activities) {
      return errorHandler.handleAPIError(404, `Activities not found`, next);
    }
    return res.json(activities);
  });
}

/*
Get a certain activity
*/
exports.get_activity = function (req, res, next) {
  const id = req.params.activityId;
  const query = Activity.findById(id).populate({ path: 'comments', model: Comment, match: { deleted_at: { $exists: false } }, populate: { path: '_user' } }).populate({ path: '_user' });
  query.exec((err, activity) => {
    if (err) return errorHandler.handleAPIError(500, `Could not get the activity with id: ${id}`, next);
    if (!activity) {
      return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
    }
    return res.json(activity);
  });
}

/*
Create a activity
*/

exports.activity_create_post = function (req, res, next) {
  let start = getRandomLatLng();
  let stop = getRandomLatLng();
  googleMapsClient.distanceMatrix({
    origins: { lat: start.lat, lng: start.lng },
    destinations: { lat: stop.lat, lng: stop.lng },
    mode: 'bicycling',
  })
    .asPromise()
    .then((response) => {
      let distance = response.json.rows[0].elements[0].distance.value;
      let moving_time = response.json.rows[0].elements[0].duration.value;
      let points = distance / 200;
      let co = distance / 1000;


      const activityDetail = { start_lat: start.lat, start_lng: stop.lng, stop_lat: stop.lat, stop_lng: stop.lng, distance: distance, points: points, moving_time: moving_time, _user: req.userId };
      const activity = new Activity(activityDetail);
      activity.save((err, activity) => {
        updateUserStats(activity, distance, points, req.userId);
        if (err) return errorHandler.handleAPIError(500, `Could not save the new activity`, next);
        res.status(201).json(activity);
      })
    })
    .catch((err) => {
      console.log(err);
    });

}

function updateUserStats(activity, distance, points, _user) {
  User.findByIdAndUpdate(_user, {
    $inc: {"stats.km": distance, "stats.pts": points },
    $push: { activities: activity }
  }, { new: true })
    .then(user => {
      if (!user) {
        return errorHandler.handleAPIError(404, `User not found with id: ${_user}`, next);
      }
      res.send(user);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `User not found with id: ${_user}`, next);
      }
      return errorHandler.handleAPIError(500, `Could not update user with id: ${_user}`, next);
    });
}
/*
Update a Post
*/
exports.post_update_get = function (req, res, next) {
  async.parallel({
    post: function (callback) {
      const id = req.params.postId;
      Post.findById(id, callback).populate('_category');
    },
    categories: function (callback) {
      Category.find(callback).sort({ created_at: -1 });
    },
  }, function (err, results) {
    if (err) { return next(err); }
    res.json({ post: results.post, categories: results.categories });
  });
}

exports.post_update_put = function (req, res, next) {
  if (!req.body || !req.body.title || !req.body.synopsis || !req.body.body || !req.body._category) {
    return errorHandler.handleAPIError(400, `Post must have a title, synopsis, body and _category`, next);
  }

  const id = req.params.postId;

  Post.findByIdAndUpdate(id, {
    title: req.body.title,
    synopsis: req.body.synopsis,
    body: req.body.body,
    _category: req.body._category,
  }, { new: true })
    .then(post => {
      if (!post) {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
      }
      res.send(post);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Post not found with id: ${id}`, next);
      }
      return errorHandler.handleAPIError(500, `Could not update post with id: ${id}`, next);
    });
}

/*
Delete a Post
*/
exports.activity_delete_delete = function (req, res, next) {
  const id = req.params.activityId;
  Activity.findByIdAndRemove(id)
    .then(activity => {
      if (!activity) {
        return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
      }
      res.status(200).json({ action: 'DELETE', message: `Activity with id: ${id} deleted successfully!` });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
      }
      return errorHandler.handleAPIError(500, `Could not delete activity with id: ${id}`, next);
    });
}


/*
Soft-undelete a post
*/
exports.activity_softundelete_patch = function (req, res, next) {
  const id = req.params.activityId;

  Activity.findByIdAndUpdate(id, {
    deleted_at: null
  }, { new: true })
    .then(activity => {
      if (!activity) {
        return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
      }
      res.send(activity);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
      }
      return errorHandler.handleAPIError(500, `Could not soft-undelete activity with id: ${id}`, next);
    });
}

/*
Get a random lat/lng from Ghent
*/
function getRandomLatLng() {
  var center = { lat: 51.05, lng: 3.7167 };
  var radius = 1000;
  var x0 = center.lng;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius / 111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x / Math.cos(y0);

  // Resulting point.
  return { 'lat': y + y0, 'lng': xp + x0 };
}
/* 
Backoffice 
*/
exports.backoffice_get_activities = function (req, res, next) {
  const query = Activity.find().populate({ path: '_user', model: User });
  query.sort({ created_at: -1 });
  query.exec((err, activities) => {
    if (err) return errorHandler.handleAPIError(500, err.message || 'Some error occurred while retrieving activities', next);
    if (!activities) {
      return errorHandler.handleAPIError(404, `Activities not found`, next);
    }
    return res.json(activities);
  });
}

exports.backoffice_get_activity = function (req, res, next) {
  const id = req.params.activityId;
  const query = Activity.findById(id).populate({ path: '_user' }).populate({path: 'comments'}).populate('likes');
  query.exec((err, activity) => {
    if (err) return errorHandler.handleAPIError(500, `Could not get the activity with id: ${id}`, next);
    if (!activity) {
      return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
    }
    return res.json(activity);
  });
}


/*
Soft-delete a post
*/
exports.activity_softdelete_patch = function(req, res, next) {
  const id = req.params.activityId;

  Activity.findByIdAndUpdate(id, {
    deleted_at: Date.now()
  }, {new: true})
    .then(activity => {
      if(!activity) {
        return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);
      }
      res.send(activity);
    }).catch(err => {
      console.log(err);
      if(err.kind === 'ObjectId') {
        return errorHandler.handleAPIError(404, `Activity not found with id: ${id}`, next);            
      }
      return errorHandler.handleAPIError(500, `Could not soft-delete activity with id: ${id}`, next);
    });
}
