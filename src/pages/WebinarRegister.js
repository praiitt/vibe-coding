import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openRazorpayCheckout } from '../services/razorpay';

const WebinarRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    experience: '', 
    goals: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const serverBaseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create order via new API endpoint
      const response = await fetch(`${serverBaseUrl}/api/webinar/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          experience: form.experience,
          goals: form.goals
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId, amount } = await response.json();

      await openRazorpayCheckout({
        name: form.name,
        email: form.email,
        phone: form.phone,
        experience: form.experience,
        goals: form.goals,
        amount: amount / 100, // Convert from paise to rupees
        onSuccess: async (resp) => {
          const verifyResponse = await fetch(`${serverBaseUrl}/api/webinar/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: resp.razorpay_order_id,
              paymentId: resp.razorpay_payment_id,
              signature: resp.razorpay_signature,
              name: form.name,
              email: form.email,
              phone: form.phone,
              experience: form.experience,
              goals: form.goals
            })
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
          }

          const result = await verifyResponse.json();
          if (result.message) {
            // Show success message before navigating
            alert('🎉 Registration successful! Your details have been saved to our database. Redirecting to confirmation page...');
            navigate('/webinar/success?ref=' + resp.razorpay_payment_id);
          } else {
            alert('Payment signature verification failed.');
          }
        },
        onFailure: async () => {
          alert('Payment failed. Please try again.');
        },
      });
    } catch (err) {
      console.error(err);
      alert('Registration failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="webinar-register">
      <div className="container">
        <div className="webinar-header">
          <h1 className="section-title">Transform Your Life with Vibe Coding</h1>
          <p className="webinar-subtitle">Discover how coding can become your creative outlet and lifestyle</p>
          <div className="webinar-details">
            <div className="detail-item">
              <i className="fas fa-calendar-alt"></i>
              <span>22 September, 7:00 PM IST</span>
            </div>
            <div className="detail-item">
              <i className="fas fa-rupee-sign"></i>
              <span>Fee: ₹99 (Limited Time)</span>
            </div>
            <div className="detail-item">
              <i className="fas fa-users"></i>
              <span>Perfect for Everyone - No Tech Background Needed!</span>
            </div>
          </div>
        </div>

        <div className="webinar-content">
          <div className="webinar-info">
            <h3>What You'll Learn:</h3>
            <ul className="learning-list">
              <li><i className="fas fa-check"></i> How coding can be creative and artistic</li>
              <li><i className="fas fa-check"></i> Simple ways to start your coding journey</li>
              <li><i className="fas fa-check"></i> How to turn coding into a lifestyle</li>
              <li><i className="fas fa-check"></i> Real stories from non-tech professionals</li>
              <li><i className="fas fa-check"></i> Practical steps to get started today</li>
            </ul>
          </div>

          <form className="webinar-form" onSubmit={onSubmit}>
            <h3>Join the Webinar</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input 
                  id="name"
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  id="email"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input 
                  id="phone"
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  type="tel" 
                  placeholder="WhatsApp preferred" 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="experience">Your Background *</label>
                <select id="experience" name="experience" value={form.experience} onChange={handleChange} required>
                  <option value="">Select your background</option>
                  <option value="No Tech Background">No Tech Background - Complete Beginner</option>
                  <option value="Some Tech Interest">Some Tech Interest - Curious about coding</option>
                  <option value="Other Professional">Other Professional - Want to learn coding</option>
                  <option value="Student">Student - Exploring career options</option>
                  <option value="Creative Professional">Creative Professional - Artist, Designer, etc.</option>
                  <option value="Business Owner">Business Owner - Want to understand tech</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="goals">What interests you most about coding? *</label>
              <textarea 
                id="goals"
                name="goals" 
                value={form.goals} 
                onChange={handleChange} 
                placeholder="Tell us what you hope to learn or achieve with coding..." 
                required 
                rows="4"
              />
            </div>
            
            <button disabled={submitting} type="submit" className="btn btn-primary webinar-submit-btn">
              {submitting ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Processing Registration...
                </>
              ) : (
                <>
                  <i className="fas fa-credit-card" style={{ marginRight: '8px' }}></i>
                  Pay ₹99 & Register Now
                </>
              )}
            </button>
            
            <p className="payment-note">
              <i className="fas fa-shield-alt"></i>
              Secure payment via Razorpay. Confirmation sent to your email.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WebinarRegister;
