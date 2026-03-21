/*
  =====================================================
  CAMPUSLINK — routes/users.js
  API endpoints for user data:
  GET /api/users       → Get all users
  GET /api/users/:id   → Get one user by ID
  =====================================================
*/

const express = require('express');
const User = require(require('path').join(__dirname, '..', 'models', 'User'));
const router  = express.Router();

// ── GET ALL USERS ──
// Used for Browse Students page
router.get('/', async (req, res) => {
  try {
    // Find all users but don't send their passwords
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET ONE USER BY ID ──
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
