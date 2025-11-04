// src/components/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';

interface AnalyticsData {
  totalUsers: number;
  usersByPlan: Record<string, number>;
  recentSubscriptions: number;
}

interface RevenueData {
  monthlyRecurringRevenue: number;
  totalSubscribers: number;
  plans: Record<string, { price: number; count: number }>;
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsData, revenueData] = await Promise.all([
          analyticsService.getAnalytics(),
          analyticsService.getRevenueData()
        ]);
        setAnalytics(analyticsData);
        setRevenue(revenueData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
        setError(errorMessage);
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const planNames: Record<string, string> = {
    'free': 'Free',
    'starter': 'Starter',
    'professional': 'Professional',
    'enterprise': 'Enterprise'
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{analytics?.totalUsers || 0}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-bold text-primary">${revenue?.monthlyRecurringRevenue || 0}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">New Subscriptions</h3>
          <p className="text-3xl font-bold text-primary">{analytics?.recentSubscriptions || 0}</p>
        </div>
      </div>
      
      {/* Revenue by Plan */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {revenue && Object.entries(revenue.plans).map(([planKey, planData]) => (
            <div key={planKey} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">{planNames[planKey] || planKey}</h3>
              <p className="text-2xl font-bold text-gray-900">${planData.price}</p>
              <p className="text-sm text-gray-600">{planData.count} users</p>
              <p className="text-lg font-semibold text-primary">
                ${planData.price * planData.count}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Users by Plan */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Users by Plan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics && Object.entries(analytics.usersByPlan).map(([plan, count]) => {
                const total = analytics.totalUsers;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <tr key={plan}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {planNames[plan] || plan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;