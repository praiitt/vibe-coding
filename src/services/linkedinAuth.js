import { apiService } from './api';

class LinkedInAuthService {
  constructor() {
    this.clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
    this.redirectUri = process.env.REACT_APP_LINKEDIN_REDIRECT_URI || 'http://localhost:3000/linkedin-callback';
    // Use only the basic profile scope that's available by default
    this.scope = 'r_liteprofile';
  }

  // Generate LinkedIn OAuth URL
  getLinkedInAuthUrl() {
    const state = this.generateRandomString();
    localStorage.setItem('linkedin_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state,
      scope: this.scope
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  // Generate random string for state parameter
  generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Handle LinkedIn callback
  async handleLinkedInCallback(code, state) {
    try {
      // Verify state parameter
      const storedState = localStorage.getItem('linkedin_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for access token
      const response = await apiService.linkedinAuth(code);
      return response;
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      throw error;
    } finally {
      // Clean up state
      localStorage.removeItem('linkedin_state');
    }
  }

  // Initiate LinkedIn login
  loginWithLinkedIn() {
    if (!this.clientId) {
      throw new Error('LinkedIn Client ID not configured');
    }
    
    const authUrl = this.getLinkedInAuthUrl();
    window.location.href = authUrl;
  }
}

export const linkedinAuthService = new LinkedInAuthService();
