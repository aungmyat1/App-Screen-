// Subscription plans configuration
const plans = {
  free: {
    name: 'Free',
    price: 0,
    downloadLimit: 10,
    batchProcessingLimit: 1,
    features: [
      '10 downloads per month',
      'Single app processing',
      'Standard resolution',
      'Email support'
    ]
  },
  starter: {
    name: 'Starter',
    price: 19,
    downloadLimit: 100,
    batchProcessingLimit: 5,
    features: [
      '100 downloads per month',
      'Batch processing (up to 5 apps)',
      'High resolution downloads',
      'API access (1000 req/mo)',
      'Email support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 49,
    downloadLimit: 500,
    batchProcessingLimit: 20,
    features: [
      '500 downloads per month',
      'Batch processing (up to 20 apps)',
      'All resolutions available',
      'API access (10,000 req/mo)',
      'Priority processing',
      'Chrome extension access',
      'Live chat support'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 149,
    downloadLimit: Infinity,
    batchProcessingLimit: Infinity,
    features: [
      'Unlimited downloads',
      'Unlimited batch processing',
      'White-label API',
      'Dedicated account manager',
      'Custom integrations',
      'Phone support'
    ]
  }
};

module.exports = plans;