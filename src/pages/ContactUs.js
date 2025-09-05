import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const ContactUs = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = [];
    
    if (form.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!form.email || !form.email.includes('@')) {
      errors.push('Valid email is required');
    }
    
    if (form.subject.length < 3) {
      errors.push('Subject must be at least 3 characters');
    }
    
    if (form.message.length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus('error');
      setErrorMessage(validationErrors.join(', '));
      setIsSubmitting(false);
      return;
    }

    const formData = {
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message
    };
    
    console.log('Form data being sent:', formData);

    try {
      await apiService.submitContactForm(formData);

      setSubmitStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-us">
      <div className="container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>Have questions about Vibe Coding? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>hello@vibe-coding.lifestyle</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-text">
                  <h3>Phone</h3>
                  <p>+919867840628</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-text">
                  <h3>Location</h3>
                  <p>Mumbai, India</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-text">
                  <h3>Response Time</h3>
                  <p>Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="social-link">
                  <i className="fab fa-discord"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <i className="fas fa-check-circle"></i>
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {errorMessage || 'Sorry, there was an error sending your message. Please try again.'}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

