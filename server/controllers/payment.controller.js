const braintree = require('braintree');
const User = require('../models/User');
const plans = require('../config/plans');
const gateway = require('../config/braintree');

// Generate client token for Braintree
const generateToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.json({ clientToken: response.clientToken });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Error generating token' });
  }
};

// Create transaction
const createTransaction = async (req, res) => {
  try {
    const { plan, paymentMethodNonce } = req.body;
    
    // Validate plan
    if (!plans[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }
    
    const planDetails = plans[plan];
    const amount = planDetails.price;
    
    // Create transaction
    const transactionResult = await gateway.transaction.sale({
      amount: amount.toFixed(2),
      paymentMethodNonce: paymentMethodNonce,
      options: {
        submitForSettlement: true
      }
    });
    
    if (transactionResult.success) {
      // Update user subscription
      const user = req.user;
      user.subscription.plan = plan;
      user.subscription.braintreeSubscriptionId = transactionResult.transaction.id;
      
      // Set expiration date (monthly subscription)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      user.subscription.expiresAt = expiresAt;
      
      // Update download limit based on plan
      user.downloadLimit = plans[plan].downloadLimit;
      
      await user.save();
      
      res.json({ 
        success: true, 
        transactionId: transactionResult.transaction.id 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: transactionResult.message 
      });
    }
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

// Handle webhook events from Braintree
const handleWebhook = async (req, res) => {
  try {
    // For local testing, you might want to temporarily log the raw body
    // console.log('Raw webhook body:', req.body);
    
    const webhookNotification = await gateway.webhookNotification.parse(
      req.body.bt_signature,
      req.body.bt_payload
    );
    
    console.log('Webhook received:', webhookNotification);
    
    // Handle different types of webhook notifications
    switch (webhookNotification.kind) {
      case braintree.WebhookNotification.Kind.SubscriptionWentActive:
        // Handle subscription activation
        console.log('Subscription activated:', webhookNotification.subscription);
        // You could send a welcome email or trigger other actions
        break;
        
      case braintree.WebhookNotification.Kind.SubscriptionCanceled:
        // Handle subscription cancellation
        console.log('Subscription canceled:', webhookNotification.subscription);
        // Downgrade the user to free plan
        await downgradeUserSubscription(webhookNotification.subscription.id);
        break;
        
      case braintree.WebhookNotification.Kind.SubscriptionChargedSuccessfully:
        // Handle successful charges
        console.log('Subscription charged successfully:', webhookNotification.subscription);
        // Extend subscription period
        await extendUserSubscription(webhookNotification.subscription.id);
        break;
        
      case braintree.WebhookNotification.Kind.SubscriptionChargedUnsuccessfully:
        // Handle failed charges
        console.log('Subscription charged unsuccessfully:', webhookNotification.subscription);
        // Notify user about payment failure
        break;
        
      case braintree.WebhookNotification.Kind.Check:
        // Handle webhook verification
        console.log('Webhook verified successfully');
        break;
        
      default:
        console.log(`Unhandled webhook kind: ${webhookNotification.kind}`);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ message: 'Error handling webhook' });
  }
};

// Helper function to downgrade user subscription to free when canceled
const downgradeUserSubscription = async (subscriptionId) => {
  try {
    const user = await User.findOne({ 'subscription.braintreeSubscriptionId': subscriptionId });
    if (user) {
      user.subscription.plan = 'free';
      user.subscription.expiresAt = null;
      user.downloadLimit = plans.free.downloadLimit;
      await user.save();
      console.log(`User ${user._id} downgraded to free plan`);
    }
  } catch (error) {
    console.error('Error downgrading user subscription:', error);
  }
};

// Helper function to extend user subscription when charged successfully
const extendUserSubscription = async (subscriptionId) => {
  try {
    const user = await User.findOne({ 'subscription.braintreeSubscriptionId': subscriptionId });
    if (user && user.subscription.plan !== 'free') {
      // Extend expiration date by 1 month
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      user.subscription.expiresAt = expiresAt;
      await user.save();
      console.log(`User ${user._id} subscription extended`);
    }
  } catch (error) {
    console.error('Error extending user subscription:', error);
  }
};

// Get user's subscription details
const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription downloadLimit downloadsUsed');
    
    res.json({
      plan: user.subscription.plan,
      expiresAt: user.subscription.expiresAt,
      downloadLimit: user.downloadLimit,
      downloadsUsed: user.downloadsUsed,
      downloadsRemaining: user.downloadLimit - user.downloadsUsed
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateToken,
  createTransaction,
  handleWebhook,
  getSubscription
};