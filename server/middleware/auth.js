const passport = require('passport');

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Please log in again.'
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

/**
 * Middleware to check if user is either admin or the assigned reviewer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAdminOrAssigned = async (req, res, next) => {
  try {
    // If user is admin, allow access
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Get request ID from route parameters
    const requestId = req.params.id;
    
    // Import Request model
    const Request = require('../models/request');
    
    // Find request
    const request = await Request.findById(requestId);
    
    // If request doesn't exist, return 404
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Check if user is assigned to this request
    if (request.assignedTo && request.assignedTo.toString() === req.user.id) {
      return next();
    }
    
    // If not admin or assigned, deny access
    res.status(403).json({
      success: false,
      message: 'Access denied. You are not authorized to access this request.'
    });
  } catch (err) {
    console.error('Error in isAdminOrAssigned middleware:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrAssigned
};