const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const plans = require('../config/plans');

// Create checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan
    if (!plans[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }
    
    const planDetails = plans[plan];
    
    // Create or retrieve Stripe customer
    let customerId = req.user.subscription.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name
      });
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      req.user.subscription.stripeCustomerId = customerId;
      await req.user.save();
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${planDetails.name} Plan`,
            description: planDetails.features.join(', ')
          },
          unit_amount: planDetails.price * 100, // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing`,
      client_reference_id: req.user._id.toString(),
      metadata: {
        plan: plan
      }
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({ message: 'Error creating payment session' });
  }
};

// Handle webhook events from Stripe
const handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id;
        
        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            const plan = session.metadata.plan;
            user.subscription.plan = plan;
            
            // Set expiration date (monthly subscription)
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            user.subscription.expiresAt = expiresAt;
            
            // Update download limit based on plan
            user.downloadLimit = plans[plan].downloadLimit;
            
            await user.save();
          }
        }
        break;
      
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
        if (user) {
          // Revert to free plan
          user.subscription.plan = 'free';
          user.downloadLimit = plans.free.downloadLimit;
          await user.save();
        }
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ message: 'Error handling webhook' });
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
  createCheckoutSession,
  handleWebhook,
  getSubscription
};