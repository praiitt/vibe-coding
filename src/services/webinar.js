import { apiService } from './api';

export async function createWebinarRegistration({ name, email, phone, experience, goals }) {
  try {
    const response = await apiService.createWebinarOrder({
      name, email, phone, experience, goals
    });
    return { id: response.orderId };
  } catch (error) {
    throw error;
  }
}

export async function updateRegistrationPayment(id, { status, razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
  try {
    await apiService.verifyWebinarPayment({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function findRegistrationByEmail(email) {
  // This would need to be implemented in the backend
  // For now, return null as it's not critical for the current functionality
  return null;
}
