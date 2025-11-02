const plans = require('../config/plans');

const checkSubscription = (requiredPlan = null) => {
  return (req, res, next) => {
    // If no specific plan required, just check if user is authenticated
    if (!requiredPlan) {
      return next();
    }
    
    const userPlan = req.user.subscription.plan;
    const userPlanOrder = Object.keys(plans).indexOf(userPlan);
    const requiredPlanOrder = Object.keys(plans).indexOf(requiredPlan);
    
    // Check if user's plan meets or exceeds the required plan
    if (userPlanOrder >= requiredPlanOrder) {
      return next();
    }
    
    return res.status(403).json({ 
      message: `This feature requires ${plans[requiredPlan].name} plan or higher` 
    });
  };
};

const checkDownloadLimit = async (req, res, next) => {
  const user = req.user;
  
  // Check if user has exceeded download limit
  if (user.downloadsUsed >= user.downloadLimit && user.downloadLimit !== Infinity) {
    return res.status(403).json({ 
      message: 'Download limit exceeded. Please upgrade your plan.' 
    });
  }
  
  next();
};

module.exports = {
  checkSubscription,
  checkDownloadLimit
};