const passport = require("passport");

/*
Auth strategies
*/
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;  
const JwtStrategy = passportJWT.Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

/*
Configuration
*/
const config = require('../../../config/config');
const jwtOptions = {  
  secretOrKey: config.auth.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

/*
Models
*/
const User = require('../models/user');

/*
Exported functions
*/
module.exports = function() {  
  // Local strategy
  const localStrategy = new LocalStrategy(
    {usernameField: "email", passwordField:"password"},
    function(username, password, done) {
      process.nextTick(function() {
        User.findOne({ 'email': username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          user.comparePassword(password, function(isMatch) {
            if (!isMatch) {
              return done(null, false);
            }
            return done(null, user);
          });
        });
      });
    }
  );
  passport.use(localStrategy);

  // Jwt strategy
  const jwtStrategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
    const id = jwt_payload.id;
    User.findById(id, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  });
  passport.use(jwtStrategy);

  // Facebook token strategy
  const fbTokenStrategy = new FacebookTokenStrategy({
    clientID: config.auth.facebook.clientID,
    clientSecret: config.auth.facebook.clientSecret
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      console.log(profile);
      User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
        return done(err, user);
      });
    });
  });
  passport.use(fbTokenStrategy);

  // Serialization
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  // Deserialization
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return {
      initialize: function() {
        return passport.initialize();
      },
      authenticateJwt: function() {
        return passport.authenticate('jwt', config.jwtSession);
      },
      authenticateLocal: function() {
        return passport.authenticate('local', config.jwtSession);
      },
      authenticateFacebook: function() {
        return passport.authenticate('facebook-token', config.jwtSession);
      }
  };
};