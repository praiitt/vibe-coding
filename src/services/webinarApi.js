import { apiService } from './api';

class WebinarApiService {
  async createRazorpayOrder(orderData) {
    return apiService.createWebinarOrder(orderData);
  }

  async verifyRazorpayPayment(paymentData) {
    return apiService.verifyWebinarPayment(paymentData);
  }

  // Legacy methods for backward compatibility
  async createOrder({ baseUrl, registrationId, amount }) {
    return this.createRazorpayOrder({ 
      amount, 
      name: 'Webinar Registration',
      email: 'user@example.com',
      receipt: `webinar_${registrationId}`
    });
  }

  async verifyPayment({ baseUrl, registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    return this.verifyRazorpayPayment({ 
      orderId: razorpay_order_id, 
      paymentId: razorpay_payment_id, 
      signature: razorpay_signature 
    });
  }
}

export const webinarApi = new WebinarApiService();
