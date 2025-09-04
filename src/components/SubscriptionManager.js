import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptions';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionManager = ({ user, showNotification, onSubscriptionChange }) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUserSubscription();
    }
  }, [currentUser]);

  const loadUserSubscription = async () => {
    try {
      const activeSubscription = await subscriptionService.getActiveSubscription(currentUser.uid);
      setSubscription(activeSubscription);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (tier) => {
    try {
      // Import Razorpay dynamically
      const { openSubscriptionCheckout } = await import('../services/razorpay');
      
      // Create subscription order via API
      const { apiService } = await import('../services/api');
      const orderData = await apiService.createSubscriptionOrder({
        tier: tier.name,
        price: tier.price
      });

      // Get Razorpay key from backend
      const keyResponse = await apiService.getRazorpayKey();
      
      const options = {
        key: keyResponse.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Vibe Coding Lifestyle',
        description: `${tier.name} Subscription`,
        order_id: '', // Will be set after order creation
        handler: async (response) => {
          try {
            // Verify payment with backend
            await apiService.verifySubscriptionPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              tier: tier.name,
              price: tier.price
            });
            
            showNotification(`🎉 Successfully subscribed to ${tier.name}! Your subscription has been saved to our database and is now active.`, 'success');
            
            // Reload subscription data
            await loadUserSubscription();
            
            if (onSubscriptionChange) {
              onSubscriptionChange(tier);
            }
          } catch (error) {
            console.error('Error verifying subscription payment:', error);
            showNotification('Payment successful but subscription verification failed. Please contact support.', 'error');
          }
        },
        prefill: {
          name: currentUser.displayName || '',
          email: currentUser.email,
        },
        theme: {
          color: tier.color || '#667eea'
        }
      };

      await openSubscriptionCheckout(orderData, options);
    } catch (error) {
      console.error('Error initiating subscription payment:', error);
      showNotification('Failed to initiate payment. Please try again.', 'error');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await subscriptionService.cancelSubscription(subscription.id);
      setSubscription(null);
      showNotification('Subscription cancelled successfully.', 'info');
      
      if (onSubscriptionChange) {
        onSubscriptionChange(null);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showNotification('Failed to cancel subscription. Please try again.', 'error');
    }
  };

  const subscriptionTiers = [
    {
      name: 'Vibe Explorer',
      price: 29,
      period: 'month',
      features: [
        'Access to Vibe Coding Foundations course',
        'Community forum access',
        'Monthly vibe sessions',
        'Basic resources and templates'
      ],
      color: '#667eea'
    },
    {
      name: 'Vibe Master',
      price: 79,
      period: 'month',
      features: [
        'All Explorer features',
        'Access to all 4 courses',
        'Personal vibe mentor',
        'Weekly live sessions',
        'Lifestyle certification',
        'Priority support'
      ],
      color: '#4ecdc4',
      featured: true
    },
    {
      name: 'Vibe Legend',
      price: 149,
      period: 'month',
      features: [
        'All Master features',
        'Custom lifestyle plan',
        'Global community leadership',
        'Exclusive events access',
        'Brand partnership opportunities',
        '1-on-1 coaching sessions'
      ],
      color: '#ff6b6b'
    }
  ];

  const getAccessLevel = () => {
    if (!subscription) return 'none';
    
    switch (subscription.tier) {
      case 'Vibe Explorer':
        return 'foundations';
      case 'Vibe Master':
        return 'all';
      case 'Vibe Legend':
        return 'all';
      default:
        return 'none';
    }
  };

  const hasCourseAccess = (courseId) => {
    const accessLevel = getAccessLevel();
    
    if (accessLevel === 'all') return true;
    if (accessLevel === 'foundations' && courseId === 'vibe-foundations') return true;
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="subscription-manager">
        <div className="container">
          <div className="loading">Loading subscription...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-manager">
      <div className="container">
        <div className="subscription-header">
          <h2>Your Subscription</h2>
          <p>Manage your vibe coding journey access</p>
        </div>

        {subscription ? (
          <div className="current-subscription">
            <div className="subscription-card active">
              <div className="subscription-info">
                <h3>{subscription.tier}</h3>
                <p className="price">${subscription.price}/month</p>
                <p className="status">Active since {new Date(subscription.startDate).toLocaleDateString()}</p>
              </div>
              <div className="subscription-features">
                <h4>Your Access:</h4>
                <ul>
                  {subscription.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="subscription-actions">
                <button 
                  className="btn btn-outline"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="subscription-options">
            <div className="subscription-grid">
              {subscriptionTiers.map((tier, index) => (
                <div 
                  key={index}
                  className={`subscription-card ${tier.featured ? 'featured' : ''}`}
                  style={{ borderColor: tier.color }}
                >
                  {tier.featured && (
                    <div className="featured-badge" style={{ backgroundColor: tier.color }}>
                      Most Popular
                    </div>
                  )}
                  <div className="tier-header">
                    <h3>{tier.name}</h3>
                    <div className="price">
                      <span className="currency">$</span>
                      <span className="amount">{tier.price}</span>
                      <span className="period">/{tier.period}</span>
                    </div>
                  </div>
                  <div className="tier-features">
                    <ul>
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex}>
                          <i className="fas fa-check"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleSubscribe(tier)}
                    style={{ backgroundColor: tier.color }}
                  >
                    Subscribe Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="course-access">
          <h3>Course Access</h3>
          <div className="access-grid">
            <div className={`access-card ${hasCourseAccess('vibe-foundations') ? 'active' : 'locked'}`}>
              <div className="access-icon">🎨</div>
              <h4>Vibe Coding Foundations</h4>
              <p>Master the fundamentals of creative programming</p>
              {hasCourseAccess('vibe-foundations') ? (
                <span className="access-status active">Access Granted</span>
              ) : (
                <span className="access-status locked">Requires Subscription</span>
              )}
            </div>
            <div className={`access-card ${hasCourseAccess('visual-vibes') ? 'active' : 'locked'}`}>
              <div className="access-icon">✨</div>
              <h4>Visual Vibes & Animations</h4>
              <p>Create stunning visual effects and animations</p>
              {hasCourseAccess('visual-vibes') ? (
                <span className="access-status active">Access Granted</span>
              ) : (
                <span className="access-status locked">Requires Vibe Master+</span>
              )}
            </div>
            <div className={`access-card ${hasCourseAccess('audio-vibes') ? 'active' : 'locked'}`}>
              <div className="access-icon">🎵</div>
              <h4>Audio Vibes & Music Programming</h4>
              <p>Code with rhythm and create generative music</p>
              {hasCourseAccess('audio-vibes') ? (
                <span className="access-status active">Access Granted</span>
              ) : (
                <span className="access-status locked">Requires Vibe Master+</span>
              )}
            </div>
            <div className={`access-card ${hasCourseAccess('lifestyle-mastery') ? 'active' : 'locked'}`}>
              <div className="access-icon">🌟</div>
              <h4>Vibe Coding Lifestyle Mastery</h4>
              <p>Transform coding into your dream lifestyle</p>
              {hasCourseAccess('lifestyle-mastery') ? (
                <span className="access-status active">Access Granted</span>
              ) : (
                <span className="access-status locked">Requires Vibe Master+</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager; 