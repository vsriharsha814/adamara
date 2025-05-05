const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// @route   POST api/auth/register
// @desc    Register a new admin user
// @access  Public (but should be restricted in production)
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    check('role', 'Role must be either admin or reviewer').isIn(['admin', 'reviewer'])
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, department } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      
      if (user) {
        return res.status(400).json({ 
          errors: [{ msg: 'User already exists' }]
        });
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
        role,
        department
      });

      // Save user to database
      await user.save();

      // Create JWT payload
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      // Sign the JWT token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret_for_development',
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(400).json({ 
          errors: [{ msg: 'Invalid credentials' }]
        });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(400).json({ 
          errors: [{ msg: 'Invalid credentials' }]
        });
      }

      // Update last login time
      user.lastLogin = Date.now();
      await user.save();

      // Create JWT payload
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      // Sign the JWT token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret_for_development',
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/auth/current
// @desc    Get current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
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