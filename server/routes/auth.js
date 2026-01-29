const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// Firebase Auth is handled client-side. The backend only verifies Firebase ID tokens.
// Keeping these endpoints as explicit "not supported" to avoid confusion.
router.post('/register', (req, res) => {
  res.status(410).json({
    success: false,
    message: 'JWT register/login removed. Use Firebase Authentication on the client.'
  });
});

router.post('/login', (req, res) => {
  res.status(410).json({
    success: false,
    message: 'JWT register/login removed. Use Firebase Authentication on the client.'
  });
});

// @route   GET api/auth/current
// @desc    Get current user
// @access  Private
router.get(
  '/current',
  authenticate,
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department
    });
  }
);

module.exports = router;