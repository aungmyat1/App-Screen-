// src/services/paymentService.ts

interface SubscriptionDetails {
  plan: string;
  expiresAt: string;
  downloadLimit: number;
  downloadsUsed: number;
  downloadsRemaining: number;
}

interface CheckoutSessionResponse {
  sessionId: string;
}

class PaymentService {
  private baseUrl = '/api/payments';

  async getSubscription(): Promise<SubscriptionDetails> {
    const response = await fetch(`${this.baseUrl}/subscription`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription details');
    }

    return await response.json();
  }

  async createCheckoutSession(plan: string): Promise<CheckoutSessionResponse> {
    const response = await fetch(`${this.baseUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ plan })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return await response.json();
  }
}

export default new PaymentService();