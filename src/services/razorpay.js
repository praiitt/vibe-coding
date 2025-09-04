import { analyticsService } from './analytics';
import { apiService } from './api';

export function loadRazorpay(src = 'https://checkout.razorpay.com/v1/checkout.js') {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}

// Webinar-specific checkout
export async function openRazorpayCheckout({ name, email, phone, experience, goals, amount = 99, onSuccess, onFailure }) {
  try {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error('Razorpay SDK failed to load');

    // Create order via API
    const orderResponse = await apiService.createWebinarOrder({
      name, email, phone, experience, goals
    });

    // Get Razorpay key from backend
    const keyResponse = await apiService.getRazorpayKey();
    
    const options = {
      key: keyResponse.key,
      amount: orderResponse.amount,
      currency: 'INR',
      order_id: orderResponse.orderId,
      name: 'Vibe Coding Webinar',
      description: 'Registration Fee',
      image: '/favicon.ico',
      handler: function (response) {
        onSuccess?.(response);
      },
      prefill: {
        name,
        email,
        contact: phone,
      },
      notes: {
        purpose: 'Webinar Registration',
        webinarDate: '2024-09-22',
      },
      theme: {
        color: '#667eea',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      onFailure?.(response.error);
    });
    rzp.open();
  } catch (error) {
    console.error('Error opening webinar checkout:', error);
    throw error;
  }
}

// Subscription checkout
export async function openSubscriptionCheckout(plan, options) {
  try {
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error('Razorpay SDK failed to load');

    // Create order via API
    const orderResponse = await apiService.createSubscriptionOrder(plan);

    // Get Razorpay key from backend
    const keyResponse = await apiService.getRazorpayKey();
    
    const razorpayOptions = {
      key: keyResponse.key,
      amount: orderResponse.amount,
      currency: 'INR',
      order_id: orderResponse.orderId,
      name: 'Vibe Coding',
      description: `${plan} Subscription`,
      image: '/favicon.ico',
      handler: function (response) {
        options.onSuccess?.(response);
      },
      theme: {
        color: '#667eea',
      },
    };

    // Track payment initiation
    await analyticsService.trackEvent('payment_initiated', {
      amount: orderResponse.amount,
      currency: 'INR',
      tier: plan,
      orderId: orderResponse.orderId
    });

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.on('payment.failed', function (response) {
      options.onFailure?.(response.error);
    });
    razorpay.open();

  } catch (error) {
    console.error('Error opening subscription checkout:', error);
    throw error;
  }
}
