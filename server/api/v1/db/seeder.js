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
const Blog = require('../models/blog');
const Category = require('../models/category');
const Post = require('../models/post');
const Activity = require('../models/activity');
const Comment = require('../models/comment');
const Role = require('../models/role');


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
let blogs = [];
let categories = [];
let posts = [];
let activities = [];
let comments = [];
let roles = [];

function blogCreate(title, synopsis, categoryId, posts, cb) {
  const blogDetail = { title: title, synopsis: synopsis, _category: categoryId, posts: posts };
  const blog = new Blog(blogDetail);

  blog.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Blog: ' + blog);
    blogs.push(blog);
    cb(null, blog);
  });
}

function categoryCreate(name, description, cb) {
  const categoryDetail = { name: name, description: description };
  const category = new Category(categoryDetail);

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function postCreate(title, synopsis, body, thumbnailUrl, categoryId, cb) {
  const postDetail = { title: title, synopsis: synopsis, body: body, thumbnailUrl: thumbnailUrl, _category: categoryId };
  const post = new Post(postDetail);

  post.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Post: ' + post);
    posts.push(post)
    cb(null, post)
  });
}


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

function roleCreate(name, cb) {
  const roleDetail = { name: name};
  const role = new Role(roleDetail);
  role.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New role: ' + role);
    roles.push(role);
    cb(null, role);
  })
}

function createBlogs(cb) {
  async.parallel([
    function (callback) {
      blogCreate(faker.lorem.sentence(), faker.lorem.paragraph(), getRandomCategory(), getRandomPosts(), callback);
    },
  ],
    cb);
}

function createCategories(cb) {
  async.parallel([
    function (callback) {
      categoryCreate(faker.lorem.word(), faker.lorem.sentence(), callback);
    },
    function (callback) {
      categoryCreate(faker.lorem.word(), faker.lorem.sentence(), callback);
    },
    function (callback) {
      categoryCreate(faker.lorem.word(), faker.lorem.sentence(), callback);
    },
    function (callback) {
      categoryCreate(faker.lorem.word(), faker.lorem.sentence(), callback);
    },
  ],
    cb);
}

function createPosts(cb) {
  async.parallel([
    function (callback) {
      postCreate(faker.lorem.sentence(), faker.lorem.paragraph(), faker.lorem.text(), faker.image.imageUrl(), getRandomCategory(), callback);
    },
    function (callback) {
      postCreate(faker.lorem.sentence(), faker.lorem.paragraph(), faker.lorem.text(), faker.image.imageUrl(), getRandomCategory(), callback);
    },
    function (callback) {
      postCreate(faker.lorem.sentence(), faker.lorem.paragraph(), faker.lorem.text(), faker.image.imageUrl(), getRandomCategory(), callback);
    },
    function (callback) {
      postCreate(faker.lorem.sentence(), faker.lorem.paragraph(), faker.lorem.text(), faker.image.imageUrl(), getRandomCategory(), callback);
    },
    function (callback) {
      postCreate(faker.lorem.sentence(), faker.lorem.paragraph(), faker.lorem.text(), faker.image.imageUrl(), getRandomCategory(), callback);
    },
    function (callback) {
      postCreate(faker.lorem.sentence(), faker.lorem.paragraph(), faker.lorem.text(), faker.image.imageUrl(), getRandomCategory(), callback);
    },
  ],
    cb);
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

function createRoles(cb) {
  async.parallel([
    function (callback) {
      roleCreate('admin', callback);
    },
    function (callback) {
      roleCreate('user', callback);
    },
  ])
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


function getRandomCategory() {
  if (categories && categories.length > 0) {
    const category = categories[Math.round(Math.random() * (categories.length - 1))];
    return category;
  }
  return null;
}

function getRandomActivity() {
  if (activities && activities.length > 0) {
    const activity = activities[Math.round(Math.random() * (activities.length - 1))];
    return activity;
  }
  return null;
}

function getRandomPosts() {
  if (posts && posts.length > 0) {
    const nPosts = Math.round(Math.random() * (posts.length - 1));
    const cPosts = posts.slice(0, posts.length);
    while (cPosts.length > nPosts) {
      cPosts.splice(Math.round(Math.random() * (posts.length - 1)), 1);
    }
    return cPosts;
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
  createCategories,
  createPosts,
  createActivities,
  createBlogs,
  createRoles
],
  function (err, results) {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    }
    mongoose.connection.close();
  });