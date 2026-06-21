const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username must be 3-30 chars (letters, numbers, underscore)'),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { username, email, password } = req.body;

    try {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        const field = existing.email === email ? 'Email' : 'Username';
        return res.status(409).json({ message: `${field} already in use` });
      }

      const user = await User.create({ username, email, password });
      const token = signToken(user._id);

      res.status(201).json({ token, user: user.toPublicJSON() });
    } catch (err) {
      res.status(500).json({ message: 'Signup failed', error: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Valid email and password required' });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = signToken(user._id);
      res.json({ token, user: user.toPublicJSON() });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  }
);

// GET /api/auth/me — current user profile
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// PUT /api/auth/profile — update profile
router.put(
  '/profile',
  auth,
  [body('profilePic').optional().isString()],
  async (req, res) => {
    try {
      if (req.body.profilePic !== undefined) {
        req.user.profilePic = req.body.profilePic;
      }
      await req.user.save();
      res.json({ user: req.user.toPublicJSON() });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
  }
);

// GET /api/auth/users/:username — public user profile
router.get('/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

module.exports = router;
