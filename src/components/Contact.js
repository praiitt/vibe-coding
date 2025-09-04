import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addContact } from '../services/contacts';

const Contact = ({ showNotification }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await addContact(data);
      showNotification('🎉 Welcome to the Vibe! You\'re now part of our community. We\'ll connect with you soon!', 'success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('❌ Failed to join the vibe. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Ready to Transform Your Life?</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Join the Movement</h3>
            <p>Ready to embrace the vibe coding lifestyle? Let's connect and start your transformation!</p>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>hello@vibe-coding.lifestyle</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-globe"></i>
                <span>vibe-coding.lifestyle</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Global Community, Everywhere</span>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                {...register('email', { 
                  required: 'Email is required',
                  validate: value => isValidEmail(value) || 'Please enter a valid email'
                })}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <textarea
                placeholder="Your Message"
                rows="5"
                {...register('message', { 
                  required: 'Message is required',
                  minLength: { value: 10, message: 'Message must be at least 10 characters' }
                })}
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-message">{errors.message.message}</span>}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Saving to Database...
                </>
              ) : 'Join the Vibe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact; 