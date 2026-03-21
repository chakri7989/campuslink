/*
  =====================================================
  CAMPUSLINK — server.js
  This is the BRAIN of your app.
  It starts the server and connects all the pieces.
  =====================================================
*/

// ── IMPORT PACKAGES ──
// These are the packages we installed with npm install
const express  = require('express');   // Creates our server
const mongoose = require('mongoose');  // Connects to MongoDB
const cors     = require('cors');      // Allows frontend to talk to backend
const dotenv   = require('dotenv');    // Reads secret keys from .env file

// ── LOAD ENVIRONMENT VARIABLES ──
// This reads your .env file where secret keys are stored
dotenv.config();

// ── CREATE EXPRESS APP ──
// express() creates your server application
const app = express();

// ── MIDDLEWARE ──
// Middleware = code that runs on EVERY request before it reaches your routes
app.use(cors());                         // Allow all origins to connect
app.use(express.json());                 // Allow server to read JSON data
app.use(express.urlencoded({ extended: true })); // Allow form data

// ── IMPORT ROUTES ──
// Routes = the different URLs your server can handle
const path = require('path');
const authRoutes  = require(path.join(__dirname, 'routes', 'auth'));
const userRoutes  = require(path.join(__dirname, 'routes', 'users'));  // /api/users

// ── USE ROUTES ──
// When someone visits /api/auth, use the authRoutes file
app.use('/api/auth',  authRoutes);
app.use('/api/users', userRoutes);

// ── HOME ROUTE ──
// When someone visits http://localhost:5000 they see this message
app.get('/', (req, res) => {
  res.json({
    message: '🚀 CampusLink API is running!',
    status:  'OK',
    version: '1.0.0'
  });
});

// ── CONNECT TO MONGODB ──
// This connects your server to the database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuslink';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.log('❌ MongoDB connection error:', error.message);
  });

// ── START SERVER ──
// This starts listening for requests on port 5000
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📡 API ready at http://localhost:${PORT}/api`);
});
