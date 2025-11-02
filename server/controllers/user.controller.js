const User = require('../models/User');
const plans = require('../config/plans');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
      apiKey: user.apiKey
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get API key
const getApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('apiKey');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Regenerate API key
const regenerateApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new API key
    user.apiKey = 'api_' + Math.random().toString(36).substr(2, 16);
    await user.save();
    
    res.json({ apiKey: user.apiKey });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getApiKey,
  regenerateApiKey
};