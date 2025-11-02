const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  getApiKey, 
  regenerateApiKey 
} = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// Get user profile (protected)
router.get('/profile', auth, getUserProfile);

// Update user profile (protected)
router.put('/profile', auth, updateUserProfile);

// Get API key (protected)
router.get('/api-key', auth, getApiKey);

// Regenerate API key (protected)
router.post('/api-key/regenerate', auth, regenerateApiKey);

module.exports = router;