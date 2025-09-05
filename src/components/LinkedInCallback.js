import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { linkedinAuthService } from '../services/linkedinAuth';

const LinkedInCallback = ({ showNotification }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithLinkedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('LinkedIn Callback Debug:', {
          code: code ? 'Present' : 'Missing',
          state: state ? 'Present' : 'Missing',
          error: error || 'None',
          errorDescription: errorDescription || 'None',
          allParams: Object.fromEntries(searchParams.entries())
        });

        // If no parameters at all, redirect to home
        if (!code && !error) {
          console.log('No OAuth parameters found, redirecting to home');
          navigate('/');
          return;
        }

        if (error) {
          const errorMsg = errorDescription || error;
          throw new Error(`LinkedIn authentication failed: ${errorMsg}`);
        }

        if (!code) {
          throw new Error('No authorization code received from LinkedIn. Please try again.');
        }

        // Handle LinkedIn callback
        await linkedinAuthService.handleLinkedInCallback(code, state);
        
        // Login with LinkedIn response
        await loginWithLinkedIn(code);
        
        showNotification('🎉 Successfully signed in with LinkedIn!', 'success');
        navigate('/dashboard');
        
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError(err.message);
        showNotification(`❌ LinkedIn authentication failed: ${err.message}`, 'error');
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithLinkedIn, showNotification]);

  if (loading) {
    return (
      <div className="linkedin-callback">
        <div className="container">
          <div className="callback-content">
            <div className="spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <h2>Completing LinkedIn Sign In...</h2>
            <p>Please wait while we complete your authentication.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="linkedin-callback">
        <div className="container">
          <div className="callback-content error">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Authentication Failed</h2>
            <p>{error}</p>
            <p>Redirecting you back to the home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LinkedInCallback;
