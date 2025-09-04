import { apiService } from './api';
import { analyticsService } from './analytics';

class SubscriptionService {
  async createSubscription(subscriptionData) {
    try {
      const response = await apiService.createSubscriptionOrder(subscriptionData.plan);
      
      // Track subscription creation
      await analyticsService.trackEvent('subscription_created', {
        tier: subscriptionData.plan,
        userId: subscriptionData.userId
      });

      return response;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getUserSubscriptions(userId) {
    try {
      // This would need to be implemented in the backend
      // For now, return the user's current subscription from the user object
      const user = await apiService.getCurrentUser();
      return user.subscription ? [user.subscription] : [];
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
      throw error;
    }
  }

  async getActiveSubscription(userId) {
    try {
      const user = await apiService.getCurrentUser();
      return user.subscription && user.subscription.isActive ? user.subscription : null;
    } catch (error) {
      console.error('Error fetching active subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      // This would need to be implemented in the backend
      // For now, just track the event
      await analyticsService.trackEvent('subscription_cancelled', {
        subscriptionId: subscriptionId
      });

      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  async updateSubscriptionStatus(subscriptionId, status) {
    try {
      // This would need to be implemented in the backend
      return true;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }
}

export const subscriptionService = new SubscriptionService();
