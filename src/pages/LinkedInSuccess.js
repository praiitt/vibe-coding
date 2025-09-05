import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LinkedInSuccess = ({ showNotification }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithLinkedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');
        const message = searchParams.get('message');

        console.log('LinkedIn Success Debug:', {
          token: token ? 'Present' : 'Missing',
          user: userParam ? 'Present' : 'Missing',
          error: error || 'None',
          message: message || 'None'
        });

        if (error) {
          throw new Error(message || error);
        }

        if (!token || !userParam) {
          throw new Error('Missing authentication data from LinkedIn callback');
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Store token and user data
        localStorage.setItem('authToken', token);
        
        // Update auth context
        await loginWithLinkedIn(token);
        
        showNotification('🎉 Successfully signed in with LinkedIn!', 'success');
        navigate('/dashboard');
        
      } catch (err) {
        console.error('LinkedIn success error:', err);
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

    handleSuccess();
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

export default LinkedInSuccess;
