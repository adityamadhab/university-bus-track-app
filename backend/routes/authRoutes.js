const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync } = require('../utils/errorHandlers');
const { protect } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation');

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register new user
router.post('/register', validateRegistration, catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'User with this email or username already exists'
    });
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
}));

// Login user
router.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);

  res.json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  });
}));

// Get current user
router.get('/me', protect, catchAsync(async (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
}));

// Update user preferences
router.patch('/preferences', protect, catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { preferences: req.body },
    { new: true, runValidators: true }
  );

  res.json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
}));

module.exports = router; 