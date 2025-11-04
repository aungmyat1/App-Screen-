// src/services/analyticsService.ts

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

class AnalyticsService {
  private baseUrl = '/api/analytics';

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  async getRevenueData(): Promise<RevenueData> {
    try {
      const response = await fetch(`${this.baseUrl}/revenue`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch revenue data: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();