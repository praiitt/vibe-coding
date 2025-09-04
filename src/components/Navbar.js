import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsService } from '../services/analytics';

const Navbar = ({ onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = async (sectionId) => {
    // Track navigation click
    await analyticsService.trackEvent('navbar_navigation_clicked', {
      section: sectionId,
      type: 'scroll_to_section'
    });

    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
    closeMenu();
  };

  const handleLinkClick = async (linkName) => {
    // Track link click
    await analyticsService.trackEvent('navbar_link_clicked', {
      link: linkName,
      type: 'route_navigation'
    });
    closeMenu();
  };

  const handleLoginClick = async () => {
    // Track login button click
    await analyticsService.trackEvent('navbar_login_clicked', {
      section: 'navbar',
      action: 'open_login_modal'
    });
    onLoginClick();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <i className="fas fa-code"></i>
          <span>vibe-coding.lifestyle</span>
        </div>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
          <li><a href="#features" onClick={() => scrollToSection('features')}>Features</a></li>
          <li><a href="#curriculum" onClick={() => scrollToSection('curriculum')}>Curriculum</a></li>
          <li><Link to="/webinar" onClick={() => handleLinkClick('webinar')}>Webinar</Link></li>
          {user ? (
            <>
              <li><Link to="/dashboard" onClick={() => handleLinkClick('dashboard')}>Dashboard</Link></li>
              <li>
                <div className="user-menu">
                  <span className="user-name">{user.name || user.email}</span>
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
              </li>
            </>
          ) : (
            <li><button className="login-btn" onClick={handleLoginClick}>Get Started</button></li>
          )}
        </ul>
        
        <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 