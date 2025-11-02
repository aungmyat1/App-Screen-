const express = require('express');
const router = express.Router();
const { downloadScreenshots, batchDownloadScreenshots } = require('../controllers/screenshot.controller');
const auth = require('../middleware/auth');
const { checkSubscription, checkDownloadLimit } = require('../middleware/subscription');

// Download screenshots (protected, requires valid subscription, checks download limit)
router.post('/download', 
  auth, 
  checkSubscription(), 
  checkDownloadLimit, 
  downloadScreenshots
);

// Batch download screenshots (protected, requires at least Starter plan)
router.post('/batch', 
  auth, 
  checkSubscription('starter'), 
  checkDownloadLimit, 
  batchDownloadScreenshots
);

module.exports = router;