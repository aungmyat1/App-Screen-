// Test script for Braintree frontend integration
// This script can be run in the browser console to verify component functionality

console.log('Testing Braintree Frontend Integration...');

// Test payment service methods
async function testPaymentService() {
  try {
    console.log('1. Testing getClientToken...');
    // This would normally import the payment service
    // For browser testing, we'll make the call directly
    const tokenResponse = await fetch('/api/payments/client-token');
    const tokenData = await tokenResponse.json();
    console.log('Client token received:', tokenData.clientToken ? '✓' : '✗');
    
    if (!tokenData.clientToken) {
      console.error('Failed to get client token');
      return;
    }
    
    console.log('Payment service tests passed ✓');
  } catch (error) {
    console.error('Payment service tests failed:', error);
  }
}

// Test component rendering
function testComponentRendering() {
  console.log('2. Testing component rendering...');
  
  // Check if required DOM elements exist
  const elementsToCheck = [
    'braintree-dropin',
    'subscription-dashboard'
  ];
  
  let allElementsFound = true;
  elementsToCheck.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      console.log(`Element ${elementId} found ✓`);
    } else {
      console.warn(`Element ${elementId} not found`);
      allElementsFound = false;
    }
  });
  
  if (allElementsFound) {
    console.log('Component rendering tests passed ✓');
  } else {
    console.log('Some components may not be rendered correctly');
  }
}

// Run tests
testPaymentService();
testComponentRendering();

console.log('Frontend integration test completed. Check console for results.');