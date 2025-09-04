import { apiService } from './api';

class AnalyticsService {
  async addEvent({ type, label, meta = {}, userId = null }) {
    try {
      await apiService.trackEvent({
        event: type,
        category: 'user_action',
        label,
        value: meta.value,
        userId,
        sessionId: this.getSessionId()
      });
    } catch (e) {
      // Non-blocking
      console.warn('analytics addEvent failed', e);
    }
  }

  async trackEvent(eventName, eventData = {}) {
    try {
      await apiService.trackEvent({
        event: eventName,
        category: eventData.category || 'general',
        label: eventData.label,
        value: eventData.value,
        userId: localStorage.getItem('userId'),
        sessionId: this.getSessionId()
      });
    } catch (e) {
      // Non-blocking
      console.warn('analytics trackEvent failed', e);
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
}

export const analyticsService = new AnalyticsService();

// Legacy export for backward compatibility
export async function addEvent({ type, label, meta = {}, userId = null }) {
  return analyticsService.addEvent({ type, label, meta, userId });
}
