const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, getSubscription } = require('../controllers/payment.controller');
const auth = require('../middleware/auth');

// Create checkout session (protected)
router.post('/checkout', auth, createCheckoutSession);

// Get subscription details (protected)
router.get('/subscription', auth, getSubscription);

// Webhook endpoint (unprotected, secured by webhook signature)
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router;