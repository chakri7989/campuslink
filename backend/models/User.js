/*
  =====================================================
  CAMPUSLINK — models/User.js
  This defines what a USER looks like in the database.
  Think of it as a template for every user record.
  =====================================================
*/

const mongoose = require('mongoose');

// ── USER SCHEMA ──
// Schema = the shape/structure of data in the database
// Every user will have these fields
const userSchema = new mongoose.Schema({

  // Basic info
  firstName: {
    type: String,      // Must be text
    required: true,    // Cannot be empty
    trim: true         // Remove extra spaces
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,      // No two users can have same email
    lowercase: true,   // Always store as lowercase
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 8       // Minimum 8 characters
  },

  // College info
  department: {
    type: String,
    required: true
  },

  year: {
    type: String,
    required: true
  },

  college: {
    type: String,
    default: 'JNTU Hyderabad'
  },

  // Profile info
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },

  // Skills = array of strings e.g. ["Python", "React", "ML"]
  skills: [{
    type: String,
    trim: true
  }],

  // Social links
  github:    { type: String, default: '' },
  linkedin:  { type: String, default: '' },
  portfolio: { type: String, default: '' },

  // Stats
  connections: { type: Number, default: 0 },
  teams:       { type: Number, default: 0 },
  points:      { type: Number, default: 0 },

  // When was this user created
  createdAt: {
    type: Date,
    default: Date.now  // Automatically set to current time
  }

});

// ── EXPORT THE MODEL ──
// This makes the User model available to other files
module.exports = mongoose.model('User', userSchema);
