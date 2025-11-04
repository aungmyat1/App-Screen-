// src/components/SubscriptionDashboard.tsx

import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';
import BraintreePaymentForm from './BraintreePaymentForm';

interface SubscriptionDetails {
  plan: string;
  expiresAt: string;
  downloadLimit: number;
  downloadsUsed: number;
  downloadsRemaining: number;
}

const SubscriptionDashboard: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getSubscription();
        setSubscription(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load subscription details';
        setError(errorMessage);
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = (newPlan: string) => {
    setSelectedPlan(newPlan);
    setShowUpgradeForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowUpgradeForm(false);
    // Refresh subscription details
    window.location.reload();
  };

  const handlePaymentError = (errorMessage: string) => {
    // Error is displayed in the payment form, no need to alert here
    console.error('Payment error:', errorMessage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (showUpgradeForm) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade Plan</h2>
          <button 
            onClick={() => setShowUpgradeForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <BraintreePaymentForm 
          plan={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8">
          <p>No subscription data available</p>
        </div>
      </div>
    );
  }

  const planNames: Record<string, string> = {
    'free': 'Free',
    'starter': 'Starter',
    'professional': 'Professional',
    'enterprise': 'Enterprise'
  };

  const planPrices: Record<string, number> = {
    'free': 0,
    'starter': 19,
    'professional': 49,
    'enterprise': 149
  };

  const planLimits: Record<string, number | string> = {
    'free': 10,
    'starter': 100,
    'professional': 500,
    'enterprise': 'Unlimited'
  };

  const isUnlimited = subscription.downloadLimit === Infinity;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Subscription Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Plan</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{planNames[subscription.plan] || subscription.plan}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.plan === 'free' ? 'bg-gray-100 text-gray-800' :
              subscription.plan === 'starter' ? 'bg-blue-100 text-blue-800' :
              subscription.plan === 'professional' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {subscription.plan === 'enterprise' ? 'ACTIVE' : 'CURRENT'}
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            ${planPrices[subscription.plan] || 0}/month
          </p>
          {subscription.expiresAt && (
            <p className="mt-2 text-gray-600">
              Renews on {formatDate(subscription.expiresAt)}
            </p>
          )}
        </div>
        
        <div className="border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage</h3>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                {subscription.downloadsUsed} of {isUnlimited ? 'Unlimited' : subscription.downloadLimit} downloads used
              </span>
              <span>
                {isUnlimited ? 'Unlimited' : subscription.downloadsRemaining} remaining
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ 
                  width: isUnlimited ? '100%' : `${Math.min(100, (subscription.downloadsUsed / subscription.downloadLimit) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(planNames).map(([planKey, planName]) => (
            planKey !== subscription.plan && (
              <div key={planKey} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition">
                <h4 className="font-medium text-gray-900">{planName}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {planLimits[planKey] === 'Unlimited' ? 'Unlimited downloads' : `${planLimits[planKey]} downloads/month`}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ${planPrices[planKey]}/month
                </p>
                <button
                  onClick={() => handleUpgrade(planKey)}
                  className="mt-3 w-full bg-primary text-white py-2 rounded-md text-sm hover:bg-primary-700 transition"
                >
                  Upgrade to {planName}
                </button>
              </div>
            )
          ))}
        </div>
        
        {subscription.plan !== 'free' && (
          <div className="mt-6">
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to cancel your subscription?')) {
                  alert('In a real implementation, this would open a cancellation confirmation dialog');
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;