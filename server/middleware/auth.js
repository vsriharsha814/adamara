const { admin } = require('../config/firebase');
const { getUserById, upsertUserFromFirebase } = require('../db/users');
const { getRequestById } = require('../db/requests');

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = (req, res, next) => {
  (async () => {
    try {
      const authHeader = req.headers.authorization || '';
      const match = authHeader.match(/^Bearer\s+(.+)$/i);
      const token = match?.[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Missing Authorization header (Bearer token required).'
        });
      }

      const decoded = await admin.auth().verifyIdToken(token);

      // Prefer Firestore user profile/role; fall back to claims/basic decoded fields.
      let user = await getUserById(decoded.uid);
      if (!user) {
        user = await upsertUserFromFirebase({
          uid: decoded.uid,
          email: decoded.email,
          name: decoded.name
        });
      }

      req.user = {
        id: decoded.uid,
        _id: decoded.uid,
        email: decoded.email || user?.email,
        name: decoded.name || user?.name,
        role: user?.role || decoded.role || decoded?.claims?.role,
        department: user?.department
      };

      return next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase ID token.'
      });
    }
  })();
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
    
    const request = await getRequestById(requestId);
    
    // If request doesn't exist, return 404
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Check if user is assigned to this request
    if (request.assignedTo && String(request.assignedTo) === String(req.user.id)) {
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