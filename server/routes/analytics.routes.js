const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth');

// All analytics routes require authentication
router.use(authenticate);

// Get basic analytics
router.get('/', analyticsController.getAnalytics);

// Get revenue data
router.get('/revenue', analyticsController.getRevenueData);

module.exports = router;