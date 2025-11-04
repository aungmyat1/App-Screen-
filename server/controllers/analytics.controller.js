const User = require('../models/User');
const mongoose = require('mongoose');

// Get basic analytics data
const getAnalytics = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get users by plan
    const usersByPlan = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format the data
    const planData = {};
    usersByPlan.forEach(plan => {
      planData[plan._id] = plan.count;
    });
    
    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubscriptions = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      totalUsers,
      usersByPlan: planData,
      recentSubscriptions
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};

// Get revenue data
const getRevenueData = async (req, res) => {
  try {
    // In a real implementation, you would connect to your payment provider's API
    // or have a separate transactions collection to get this data
    
    // For now, we'll simulate based on plan data
    const plans = {
      free: { price: 0, count: 0 },
      starter: { price: 19, count: 0 },
      professional: { price: 49, count: 0 },
      enterprise: { price: 149, count: 0 }
    };
    
    // Get user counts by plan
    const usersByPlan = await User.aggregate([
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Populate the plan counts
    usersByPlan.forEach(plan => {
      if (plans[plan._id]) {
        plans[plan._id].count = plan.count;
      }
    });
    
    // Calculate revenue
    let monthlyRecurringRevenue = 0;
    let totalSubscribers = 0;
    
    Object.values(plans).forEach(plan => {
      monthlyRecurringRevenue += plan.price * plan.count;
      if (plan.price > 0) {
        totalSubscribers += plan.count;
      }
    });
    
    res.json({
      monthlyRecurringRevenue,
      totalSubscribers,
      plans
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ message: 'Error fetching revenue data' });
  }
};

module.exports = {
  getAnalytics,
  getRevenueData
};