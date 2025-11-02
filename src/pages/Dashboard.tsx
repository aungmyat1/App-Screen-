// src/pages/Dashboard.tsx

import React from 'react';
import SubscriptionDashboard from '../components/SubscriptionDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and usage</p>
        </div>
        
        <SubscriptionDashboard />
        
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Access</h2>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your API Key</h3>
                <p className="text-gray-600 mt-1">Use this key to authenticate with our API</p>
              </div>
              <button 
                onClick={() => alert('In a real implementation, this would copy the API key to clipboard')}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Copy Key
              </button>
            </div>
            <div className="mt-4 bg-gray-50 p-3 rounded font-mono text-sm">
              sk_api_your_api_key_will_appear_here
            </div>
            <div className="mt-4">
              <a 
                href="#" 
                className="text-primary hover:text-primary-700 font-medium"
              >
                View API Documentation →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;