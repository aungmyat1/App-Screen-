// src/components/BraintreePaymentForm.tsx

import React, { useState, useEffect } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import paymentService from '../services/paymentService';

interface Props {
  plan: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const BraintreePaymentForm: React.FC<Props> = ({ plan, onPaymentSuccess, onPaymentError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [instance, setInstance] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const { clientToken } = await paymentService.getClientToken();
        setClientToken(clientToken);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment form';
        setError(errorMessage);
        onPaymentError(errorMessage);
      }
    };

    fetchClientToken();
  }, [onPaymentError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!instance) {
      const errorMessage = 'Payment form not initialized';
      setError(errorMessage);
      onPaymentError(errorMessage);
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      // Get payment method nonce from Drop-in
      const payload = await instance.requestPaymentMethod();
      
      const result = await paymentService.createTransaction(plan, payload.nonce);
      
      if (result.success) {
        onPaymentSuccess();
      } else {
        const errorMessage = result.message || 'Payment failed';
        setError(errorMessage);
        onPaymentError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Plan names mapping
  const planNames: Record<string, string> = {
    'free': 'Free',
    'starter': 'Starter',
    'professional': 'Professional',
    'enterprise': 'Enterprise'
  };

  // Plan prices mapping
  const planPrices: Record<string, number> = {
    'free': 0,
    'starter': 19,
    'professional': 49,
    'enterprise': 149
  };

  if (error && !clientToken) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!clientToken) {
    return <div>Loading payment form...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Complete Your Purchase</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Plan:</span>
          <span className="font-bold">{planNames[plan] || plan}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium">Price:</span>
          <span className="font-bold">${planPrices[plan] || 0}/month</span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg">
          Error: {error}
        </div>
      )}
      
      <div id="braintree-dropin" className="py-2">
        <DropIn
          options={{ authorization: clientToken }}
          onInstance={setInstance}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <button 
          type="submit" 
          disabled={isProcessing || !instance}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isProcessing || !instance 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : `Pay $${planPrices[plan] || 0} Now`}
        </button>
      </form>
    </div>
  );
};

export default BraintreePaymentForm;