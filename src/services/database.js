// Local Database Service - Legacy service (not used in MongoDB version)
class DatabaseService {
  constructor() {
    this.storageKey = 'vibe_coding_lifestyle_db';
    this.initializeLocalStorage();
  }

  // Initialize local storage with default data
  initializeLocalStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = {
        users: [],
        contacts: [],
        subscriptions: [],
        analytics: {
          pageViews: 0,
          formSubmissions: 0,
          buttonClicks: 0
        }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
  }

  // Get all data
  getData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return {};
    }
  }

  // Save data
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to local storage:', error);
      return false;
    }
  }

  // Contact form submissions
  async submitContactForm(formData) {
    const data = this.getData();
    const newContact = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    data.contacts.push(newContact);
    data.analytics.formSubmissions += 1;
    
    this.saveData(data);
    return newContact;
  }

  // User registration
  async registerUser(userData) {
    const data = this.getData();
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    data.users.push(newUser);
    this.saveData(data);
    return newUser;
  }

  // User authentication
  async createUser(userData) {
    return this.registerUser(userData);
  }

  async authenticateUser(email, password) {
    const data = this.getData();
    const user = data.users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  async getUserById(userId) {
    const data = this.getData();
    return data.users.find(u => u.id === userId) || null;
  }

  // Subscription management
  async createSubscription(subscriptionData) {
    const data = this.getData();
    const newSubscription = {
      id: Date.now().toString(),
      ...subscriptionData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    data.subscriptions.push(newSubscription);
    this.saveData(data);
    return newSubscription;
  }

  async getUserSubscriptions(userId) {
    const data = this.getData();
    return data.subscriptions.filter(sub => sub.userId === userId) || [];
  }

  async cancelSubscription(subscriptionId) {
    const data = this.getData();
    const subscription = data.subscriptions.find(sub => sub.id === subscriptionId);
    if (subscription) {
      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date().toISOString();
      this.saveData(data);
    }
    return subscription;
  }

  // Analytics tracking
  async trackEvent(eventType, eventData = {}) {
    const data = this.getData();
    
    switch (eventType) {
      case 'pageView':
        data.analytics.pageViews += 1;
        break;
      case 'buttonClick':
        data.analytics.buttonClicks += 1;
        break;
      case 'formSubmission':
        data.analytics.formSubmissions += 1;
        break;
      default:
        // Handle custom events
        if (!data.analytics[eventType]) {
          data.analytics[eventType] = 0;
        }
        data.analytics[eventType] += 1;
    }
    
    this.saveData(data);
  }

  // Get analytics
  async getAnalytics() {
    const data = this.getData();
    return data.analytics || {};
  }

  // Get contacts
  async getContacts() {
    const data = this.getData();
    return data.contacts || [];
  }

  // Get users
  async getUsers() {
    const data = this.getData();
    return data.users || [];
  }

  // Get subscriptions
  async getSubscriptions() {
    const data = this.getData();
    return data.subscriptions || [];
  }

  // Course progress tracking
  async getUserProgress(userId) {
    const data = this.getData();
    return data.userProgress?.[userId] || {};
  }

  async getLessonProgress(userId, courseId, moduleIndex, lessonIndex) {
    const data = this.getData();
    const key = `${courseId}-${moduleIndex}-${lessonIndex}`;
    return data.lessonProgress?.[userId]?.[key] || {};
  }

  async markLessonComplete(userId, courseId, moduleIndex, lessonIndex) {
    const data = this.getData();
    
    // Initialize progress tracking if not exists
    if (!data.userProgress) data.userProgress = {};
    if (!data.lessonProgress) data.lessonProgress = {};
    if (!data.userProgress[userId]) data.userProgress[userId] = {};
    if (!data.lessonProgress[userId]) data.lessonProgress[userId] = {};
    
    // Mark lesson as complete
    const lessonKey = `${courseId}-${moduleIndex}-${lessonIndex}`;
    data.lessonProgress[userId][lessonKey] = {
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    // Update course progress
    const courseProgress = this.calculateCourseProgress(data.lessonProgress[userId], courseId);
    data.userProgress[userId][courseId] = courseProgress;
    
    this.saveData(data);
    return true;
  }

  calculateCourseProgress(lessonProgress, courseId) {
    // This is a simplified calculation - you can make it more sophisticated
    const courseLessons = Object.keys(lessonProgress).filter(key => key.startsWith(courseId));
    const completedLessons = courseLessons.filter(key => lessonProgress[key].completed);
    
    return Math.round((completedLessons.length / courseLessons.length) * 100) || 0;
  }

  // Search functionality
  async searchContacts(query) {
    const contacts = await this.getContacts();
    return contacts.filter(contact => 
      contact.name?.toLowerCase().includes(query.toLowerCase()) ||
      contact.email?.toLowerCase().includes(query.toLowerCase()) ||
      contact.message?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Export data (legacy function)
  exportData() {
    return this.getData();
  }

  // Import data (legacy function)
  importData(data) {
    return this.saveData(data);
  }

  // Clear all data (for testing)
  clearData() {
    localStorage.removeItem(this.storageKey);
    this.initializeLocalStorage();
  }
}

// Legacy Firebase service (removed - using MongoDB now)
// This file is kept for reference but is not used in the current MongoDB implementation

// Export only the local database service (legacy)
export const localDatabase = new DatabaseService();

// Default export for easy switching between local and Firebase
export default localDatabase; 