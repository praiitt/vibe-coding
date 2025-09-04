import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { analyticsService } from '../services/analytics';
import { apiService } from '../services/api';

const Pricing = ({ showNotification }) => {
  const { currentUser } = useAuth();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const [processingTier, setProcessingTier] = useState(null);

  const pricingTiers = [
    {
      name: 'Vibe Explorer',
      price: 29,
      period: '/month',
      features: [
        'Core lifestyle modules',
        'Community access',
        'Monthly vibe sessions',
        'Basic resources'
      ],
      buttonText: 'Start Exploring',
      featured: false
    },
    {
      name: 'Vibe Master',
      price: 79,
      period: '/month',
      features: [
        'All Explorer features',
        'Advanced lifestyle coaching',
        'Personal vibe mentor',
        'Weekly live sessions',
        'Lifestyle certification'
      ],
      buttonText: 'Become a Master',
      featured: true,
      badge: 'Lifestyle Choice'
    },
    {
      name: 'Vibe Legend',
      price: 149,
      period: '/month',
      features: [
        'All Master features',
        'Custom lifestyle plan',
        'Global community leadership',
        'Exclusive events access',
        'Brand partnership opportunities'
      ],
      buttonText: 'Become a Legend',
      featured: false
    }
  ];

  const handlePricingClick = async (tier) => {
    // Track pricing button click
    await analyticsService.trackEvent('pricing_button_clicked', {
      tier: tier.name,
      price: tier.price,
      userLoggedIn: !!currentUser
    });

    if (!currentUser) {
      showNotification('Please login to subscribe to a plan', 'info');
      // Trigger login modal - you might want to pass a callback to open login modal
      return;
    }

    setProcessingTier(tier.name);

    try {
      // Import Razorpay dynamically
      const { openSubscriptionCheckout } = await import('../services/razorpay');
      
      // Create subscription order via API
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
        order_id: orderData.orderId,
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
            
            showNotification(`🎉 Successfully subscribed to ${tier.name}! Your subscription has been saved to our database.`, 'success');
            
            // Track successful subscription
            await analyticsService.trackEvent('subscription_completed', {
              tier: tier.name,
              price: tier.price,
              paymentId: response.razorpay_payment_id
            });
          } catch (error) {
            console.error('Error verifying subscription payment:', error);
            showNotification('Payment successful but subscription verification failed. Please contact support.', 'error');
          }
        },
        prefill: {
          name: currentUser.name || '',
          email: currentUser.email,
        },
        theme: {
          color: '#667eea'
        }
      };

      await openSubscriptionCheckout(orderData, options);
    } catch (error) {
      console.error('Error initiating subscription payment:', error);
      showNotification('Failed to initiate payment. Please try again.', 'error');
    } finally {
      setProcessingTier(null);
    }
  };

  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <h2 className="section-title">Choose Your Lifestyle Tier</h2>
        <div className="pricing-grid" ref={ref}>
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`pricing-card ${tier.featured ? 'featured' : ''}`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
              }}
            >
              {tier.badge && (
                <div className="pricing-badge">{tier.badge}</div>
              )}
              <div className="pricing-header">
                <h3>{tier.name}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{tier.price}</span>
                  <span className="period">{tier.period}</span>
                </div>
              </div>
              <ul className="pricing-features">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`btn ${tier.featured ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handlePricingClick(tier)}
                disabled={processingTier === tier.name}
              >
                {processingTier === tier.name ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Processing...
                  </>
                ) : tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 