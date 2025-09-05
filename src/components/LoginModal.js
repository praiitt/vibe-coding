import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { linkedinAuthService } from '../services/linkedinAuth';

const LoginModal = ({ isOpen, onClose, onLogin, showNotification }) => {
  const { signup, login, loginWithLinkedIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  // const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const onCaptchaSuccess = () => {
  //   setCaptchaVerified(true);
  // };

  const handleLinkedInLogin = async () => {
    try {
      linkedinAuthService.loginWithLinkedIn();
    } catch (error) {
      console.error('LinkedIn login error:', error);
      showNotification('❌ LinkedIn login failed. Please try again.', 'error');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    // For testing purposes, skip reCAPTCHA validation
    // if (!captchaVerified) {
    //   showNotification('Please verify the captcha before continuing.', 'error');
    //   return;
    // }
    setSubmitting(true);
    try {
      let response;
      if (isSignUp) {
        response = await signup(formData.name, formData.email, formData.password);
        showNotification('🎉 Account created successfully! Your profile has been saved to our database.', 'success');
      } else {
        response = await login(formData.email, formData.password);
        showNotification('👋 Welcome back! Successfully signed in.', 'success');
      }
      onLogin?.(response.user);
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      
      // Better error handling with specific messages
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.message.includes('already exists')) {
        errorMessage = '✅ This email is already registered. Please try logging in instead.';
      } else if (error.message.includes('Invalid credentials')) {
        errorMessage = '❌ Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('Email')) {
        errorMessage = '❌ Please provide a valid email address.';
      } else if (error.message.includes('Password')) {
        errorMessage = '❌ Password must be at least 6 characters long.';
      } else if (error.message.includes('Name')) {
        errorMessage = '❌ Please provide your full name.';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleEmailAuth} className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
                          <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
          </div>

          {/* reCAPTCHA widget */}
          <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="g-recaptcha"
              data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              data-callback={() => {/* onCaptchaSuccess() */}}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (isSignUp ? 'Creating...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          className="btn btn-linkedin" 
          onClick={handleLinkedInLogin}
          disabled={submitting}
        >
          <i className="fab fa-linkedin"></i>
          {isSignUp ? 'Sign up with LinkedIn' : 'Sign in with LinkedIn'}
        </button>

        <div className="auth-switch">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              className="switch-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; 