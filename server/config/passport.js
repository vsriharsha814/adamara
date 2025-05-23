const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Import User model - make sure to require this before using it
// The path should point to your User model file
const User = require('../models/user');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret_for_development'
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        // Find the user by id from the JWT payload
        const user = await User.findById(jwt_payload.id);
        
        if (user) {
          // If user is found, return the user
          return done(null, user);
        }
        
        // If no user is found, return false
        return done(null, false);
      } catch (err) {
        console.error('Error in JWT strategy:', err);
        return done(err, false);
      }
    })
  );
};