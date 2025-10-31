const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request:', { url, config });

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', { status: response.status, data });
        
        // Handle validation errors specifically
        if (response.status === 400 && data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Contact form
  async submitContactForm(contactData) {
    console.log('API Service - Contact data:', contactData);
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Analytics
  async trackEvent(eventData) {
    return this.request('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Subscriptions
  async createSubscriptionOrder(plan) {
    return this.request('/api/subscription/create', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async verifySubscription(paymentData) {
    return this.request('/api/subscription/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Webinar
  async createWebinarOrder(registrationData) {
    return this.request('/api/webinar/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  }

  async verifyWebinarPayment(paymentData) {
    return this.request('/api/webinar/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Razorpay key
  async getRazorpayKey() {
    return this.request('/api/razorpay-key');
  }

  // Course registration
  async registerForCourse(courseId, courseTitle) {
    return this.request('/api/courses/register', {
      method: 'POST',
      body: JSON.stringify({ courseId, courseTitle }),
    });
  }

  async getMyCourses() {
    return this.request('/api/courses/my-courses');
  }

  // LinkedIn Authentication
  async linkedinAuth(code) {
    return this.request('/api/auth/linkedin', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // ===== LMS APIs =====
  // Courses
  async getCourses(includeUnpublished = false) {
    const params = includeUnpublished ? '?includeUnpublished=true' : '';
    return this.request(`/api/courses${params}`);
  }

  async getCourse(slug) {
    return this.request(`/api/courses/${slug}`);
  }

  async createCourse(courseData) {
    return this.request('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(courseId, courseData) {
    return this.request(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(courseId) {
    return this.request(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  // Enrollments
  async enrollInCourse(courseId) {
    return this.request('/api/lms/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getMyEnrollments() {
    return this.request('/api/lms/my-enrollments');
  }

  // Progress
  async updateProgress(progressData) {
    return this.request('/api/lms/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async getProgress(courseId) {
    return this.request(`/api/lms/progress/${courseId}`);
  }

  // AI Generation
  async generateText(prompt) {
    return this.request('/api/ai/generate-text', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async generateImage(prompt) {
    return this.request('/api/ai/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }
}

export const apiService = new ApiService();
