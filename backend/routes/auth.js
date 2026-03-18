/*
  =====================================================
  CAMPUSLINK — routes/auth.js
  These are the API endpoints for:
  1. POST /api/auth/register → Create new account
  2. POST /api/auth/login    → Login to account
  =====================================================
*/

const express  = require('express');
const bcrypt   = require('bcryptjs');    // For encrypting passwords
const jwt      = require('jsonwebtoken'); // For creating login tokens
const User     = require('../models/User'); // Our User model

const router = express.Router(); // Creates a mini router

// ──────────────────────────────────────
// REGISTER — POST /api/auth/register
// Creates a new user account
// ──────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    // Step 1: Get data sent from the frontend form
    const { firstName, lastName, email, password, department, year, skills } = req.body;

    // Step 2: Check if all required fields are present
    if (!firstName || !lastName || !email || !password || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Step 3: Check if email already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Step 4: Encrypt the password before saving
    // bcrypt turns "mypassword123" into "$2b$10$xyz..." (unreadable)
    const salt           = await bcrypt.genSalt(10); // Security level
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Create new user in database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Save encrypted password NOT plain text
      department,
      year,
      skills: skills || []
    });

    await newUser.save(); // Save to MongoDB

    // Step 6: Create a JWT token (proves user is logged in)
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email }, // Data inside token
      process.env.JWT_SECRET || 'campuslink_secret_key', // Secret key
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Step 7: Send success response back to frontend
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id:         newUser._id,
        firstName:  newUser.firstName,
        lastName:   newUser.lastName,
        email:      newUser.email,
        department: newUser.department,
        year:       newUser.year,
        skills:     newUser.skills
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// ──────────────────────────────────────
// LOGIN — POST /api/auth/login
// Logs in an existing user
// ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    // Step 1: Get email and password from frontend
    const { email, password } = req.body;

    // Step 2: Check if fields are present
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email and password'
      });
    }

    // Step 3: Find user in database by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Step 4: Check if password is correct
    // bcrypt.compare checks if "mypassword123" matches the encrypted version
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Step 5: Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'campuslink_secret_key',
      { expiresIn: '7d' }
    );

    // Step 6: Send success response
    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id:         user._id,
        firstName:  user.firstName,
        lastName:   user.lastName,
        email:      user.email,
        department: user.department,
        year:       user.year,
        skills:     user.skills
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

module.exports = router;