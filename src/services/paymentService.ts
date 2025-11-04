// src/services/paymentService.ts

interface SubscriptionDetails {
  plan: string;
  expiresAt: string;
  downloadLimit: number;
  downloadsUsed: number;
  downloadsRemaining: number;
}

interface ClientTokenResponse {
  clientToken: string;
}

interface TransactionResponse {
  success: boolean;
  transactionId?: string;
  message?: string;
}

class PaymentService {
  private baseUrl = '/api/payments';

  async getSubscription(): Promise<SubscriptionDetails> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscription details: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  async getClientToken(): Promise<ClientTokenResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/client-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch client token: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client token:', error);
      throw error;
    }
  }

  async createTransaction(plan: string, paymentMethodNonce: string): Promise<TransactionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan, paymentMethodNonce })
      });

      if (!response.ok) {
        throw new Error(`Failed to create transaction: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
}

export default new PaymentService();