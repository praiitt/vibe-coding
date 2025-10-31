import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsService } from '../services/analytics';
import { apiService } from '../services/api';

const Hero = ({ showNotification }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithLinkedIn } = useAuth();
  const [inViewRef, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  const statsRef = useRef(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joinForm, setJoinForm] = useState({
    name: '',
    email: '',
    phone: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [joinCaptchaVerified, setJoinCaptchaVerified] = useState(false);

  // Handle LinkedIn OAuth success
  useEffect(() => {
    const handleLinkedInSuccess = async () => {
      const linkedinSuccess = searchParams.get('linkedin_success');
      const token = searchParams.get('token');
      const userParam = searchParams.get('user');
      const error = searchParams.get('error');
      const message = searchParams.get('message');

      console.log('LinkedIn Success Debug:', {
        linkedinSuccess,
        token: token ? 'Present' : 'Missing',
        userParam: userParam ? 'Present' : 'Missing',
        error: error || 'None',
        message: message || 'None',
        allParams: Object.fromEntries(searchParams.entries())
      });

      if (linkedinSuccess && token && userParam) {
        try {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(userParam));
          console.log('Parsed user data:', userData);

          // Store token and user data
          localStorage.setItem('authToken', token);
          
          // Update auth context
          await loginWithLinkedIn(token);
          
          showNotification('🎉 Successfully signed in with LinkedIn!', 'success');
          navigate('/dashboard');
          
        } catch (err) {
          console.error('LinkedIn success error:', err);
          showNotification(`❌ LinkedIn authentication failed: ${err.message}`, 'error');
        }
      } else if (error) {
        showNotification(`❌ LinkedIn authentication failed: ${message || error}`, 'error');
      }
    };

    handleLinkedInSuccess();
  }, [searchParams, navigate, loginWithLinkedIn, showNotification]);

  useEffect(() => {
    if (inView && statsRef.current) {
      const stats = statsRef.current.querySelectorAll('.stat-number');
      stats.forEach((stat, index) => {
        const finalValue = stat.textContent;
        const isPercentage = finalValue.includes('%');
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        animateCounter(stat, 0, numericValue, isPercentage ? '%' : '+', index * 200);
      });
    }
  }, [inView]);

  const animateCounter = (element, start, end, suffix = '', delay = 0) => {
    setTimeout(() => {
      const duration = 2000;
      const startTime = performance.now();
      
      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }
      
      requestAnimationFrame(updateCounter);
    }, delay);
  };

  const handleJoinMovement = async () => {
    await analyticsService.trackEvent('hero_join_movement_clicked', {
      section: 'hero',
      action: 'open_join_modal'
    });
    setJoinSuccess(false);
    setShowJoinModal(true);
  };

  const handleJoinWebinar = async () => {
    await analyticsService.trackEvent('hero_join_webinar_clicked', {
      section: 'hero',
      action: 'navigate_to_webinar'
    });
    window.location.href = '/webinar';
  };

  const handleJoinFormChange = (e) => {
    setJoinForm({
      ...joinForm,
      [e.target.name]: e.target.value
    });
  };

  const handleJoinFormSubmit = async (e) => {
    e.preventDefault();
    
    // For testing purposes, skip reCAPTCHA validation
    // if (!joinCaptchaVerified) {
    //   showNotification('Please verify the captcha before submitting.', 'error');
    //   return;
    // }
    
    setIsSubmitting(true);

    try {
      await apiService.submitContactForm({
        name: joinForm.name,
        email: joinForm.email,
        subject: 'Join the Vibe Movement',
        message: `Phone: ${joinForm.phone}\nInterests: ${joinForm.interests}\n\nJoined via Hero section`
      });

      showNotification('🎉 Welcome to the Vibe! Your details have been saved. We\'ll connect with you soon!', 'success');
      await analyticsService.trackEvent('hero_join_movement_completed', {
        section: 'hero',
        action: 'form_submitted',
        name: joinForm.name,
        email: joinForm.email
      });

      setJoinForm({ name: '', email: '', phone: '', interests: '' });
      setJoinSuccess(true);
    } catch (error) {
      console.error('Error joining movement:', error);
      
      // Better error handling with specific messages
      let errorMessage = '❌ Failed to join the movement. Please try again.';
      
      if (error.message.includes('Subject must be at least')) {
        errorMessage = '❌ Please provide a valid subject.';
      } else if (error.message.includes('Email')) {
        errorMessage = '❌ Please provide a valid email address.';
      } else if (error.message.includes('Name')) {
        errorMessage = '❌ Please provide your full name.';
      } else if (error.message.includes('Message must be at least')) {
        errorMessage = '❌ Please provide more details about your interests.';
      } else if (error.message.includes('already exists')) {
        errorMessage = '✅ You\'re already part of the movement! Welcome back!';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container" ref={inViewRef}>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to the
            <span className="gradient-text"> Vibe Coding Lifestyle</span>
          </h1>
          <p className="hero-subtitle">
            Where coding meets creativity, rhythm meets logic, and programming becomes an art form. 
            Join the movement that's redefining what it means to be a developer in the future.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleJoinMovement}>
              Join the Movement
            </button>
            <button className="btn btn-secondary" onClick={handleJoinWebinar}>
              Join the Webinar
            </button>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Lifestyle Enthusiasts</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Creative Projects</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Vibe Community</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-animation">
            <div className="code-line">
              <span className="code-keyword">const</span>
              <span className="code-variable">vibeLifestyle</span>
              <span className="code-punctuation">=</span>
              <span className="code-string">"🎵 rhythm + logic"</span>
              <span className="code-punctuation">;</span>
            </div>
            <div className="code-line">
              <span className="code-keyword">function</span>
              <span className="code-function">liveVibe</span>
              <span className="code-punctuation">()</span>
              <span className="code-punctuation">{'{'}</span>
            </div>
            <div className="code-line">
              <span className="code-indent">  </span>
              <span className="code-keyword">return</span>
              <span className="code-string">"✨ creativity + code + lifestyle"</span>
              <span className="code-punctuation">;</span>
            </div>
            <div className="code-line">
              <span className="code-punctuation">{'}'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Join Movement Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Join the Vibe Movement</h2>
              <button className="close-btn" onClick={() => setShowJoinModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            {!joinSuccess ? (
              <form onSubmit={handleJoinFormSubmit} className="join-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={joinForm.name}
                    onChange={handleJoinFormChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={joinForm.email}
                    onChange={handleJoinFormChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={joinForm.phone}
                    onChange={handleJoinFormChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="interests">What interests you most?</label>
                  <select
                    id="interests"
                    name="interests"
                    value={joinForm.interests}
                    onChange={handleJoinFormChange}
                    required
                  >
                    <option value="">Select your interest</option>
                    <option value="creative-coding">Creative Coding</option>
                    <option value="music-programming">Music Programming</option>
                    <option value="lifestyle-transformation">Lifestyle Transformation</option>
                    <option value="community">Community & Networking</option>
                    <option value="all">All of the above</option>
                  </select>
                </div>

                {/* reCAPTCHA widget */}
                <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className="g-recaptcha"
                    data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    data-callback={() => {/* setJoinCaptchaVerified(true) */}}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                      Joining the Vibe...
                    </>
                  ) : 'Join the Movement'}
                </button>
              </form>
            ) : (
              <div className="join-success">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3>You're in! 🎉</h3>
                <p>Thanks for joining the Vibe Movement. We'll reach out soon with next steps.</p>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={() => { setShowJoinModal(false); navigate('/webinar'); }}>
                    Join the Webinar
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero; 