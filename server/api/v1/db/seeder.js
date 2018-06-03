console.log('This script populates some test posts to your database. Specified database as argument - e.g.: seeder mongodb://your_username:your_password@your_dabase_url');

/*
Cool programe
*/

/*
Libraries
*/
const async = require('async');
const mongoose = require('mongoose');
const faker = require('faker');

/*
Models
*/
const Activity = require('../models/activity');
const Comment = require('../models/comment');


// Get arguments passed on command line
const userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return;
}

/*
Google Maps
*/
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAMFOXgK0rg2MC_Kx5vrDhInQ2GEa5YVVM',
  Promise: Promise
});

/*
Faker
*/
faker.local = 'nl';

/*
Mongoose
*/
const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*
Variables
*/
let activities = [];
let comments = [];

function activityCreate(comments,cb) {
  // Generate 2 random LatLng
  let start_point = getRandomLatLng();
  let stop_point = getRandomLatLng();
  let distance = 0;
  let points = 0;
  let moving_time = 0;

  googleMapsClient.distanceMatrix({
    origins: { lat: start_point.lat, lng: start_point.lng },
    destinations: { lat: stop_point.lat, lng: stop_point.lng },
    mode: 'bicycling',
  })
    .asPromise()
    .then((response) => {
      //console.log(JSON.stringify(response));
      distance = response.json.rows[0].elements[0].distance.value;
      moving_time = response.json.rows[0].elements[0].duration.value;
      points = distance / 100;
      //console.log(response.json.rows[0].elements[0].distance.value);
      const activityDetail = { start_lat: start_point.lat, start_lng: start_point.lng, stop_lat: stop_point.lat, stop_lng: stop_point.lng, distance: distance, points: points, moving_time: moving_time, comments: comments };
      const activity = new Activity(activityDetail);
      activity.save((err) => {
        if (err) {
          cb(err, null);
          return;
        }
        console.log('New Activity: ' + activity);
        activities.push(activity)
        cb(null, activity)
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function commentCreate(body, cb) {
  const commentDetail = { body: body };
  const comment = new Comment(commentDetail);
  comment.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Comment: ' + comment);
    comments.push(comment)
    cb(null, comment)
  });
}

function createActivities(cb) {
  async.parallel([
    function (callback) {
      activityCreate(getRandomComments() ,callback);
    },
    function (callback) {
      activityCreate(getRandomComments() ,callback);
    },
    function (callback) {
      activityCreate(getRandomComments() ,callback);
    },
    function (callback) {
      activityCreate(getRandomComments() ,callback);
    },
    function (callback) {
      activityCreate(getRandomComments() ,callback);
    },
    function (callback) {
      activityCreate(getRandomComments() ,callback);
    },
  ],
    cb);
}

function createComments(cb) {
  async.parallel([
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
    function (callback) {
      commentCreate(faker.lorem.sentence(), callback)
    },
  ],
    cb)
}


function getRandomActivity() {
  if (activities && activities.length > 0) {
    const activity = activities[Math.round(Math.random() * (activities.length - 1))];
    return activity;
  }
  return null;
}

function getRandomComments() {
  if (comments && comments.length > 0) {
    const nComments = Math.round(Math.random() * (comments.length -1));
    const cComments = comments.slice(0, comments.length);
    while (cComments.length > nComments.length) {
      cComments.splice(Math.round(Math.random() * (comments.length -1)), 1);
    }
    return cComments;
  }
  return null;
}

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
Asynchronous series
*/
async.series([
  createComments,
  createActivities,
],
  function (err, results) {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    }
    mongoose.connection.close();
  });