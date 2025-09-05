import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (name, email, password) => {
    try {
      const response = await apiService.register({ name, email, password });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const loginWithLinkedIn = async (code) => {
    try {
      const response = await apiService.linkedinAuth(code);
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await apiService.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    loginWithLinkedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
