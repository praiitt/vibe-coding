import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/vibe-coding-logo _cropped.png" alt="Vibe Coding" className="footer-logo-img" />
              <span>vibe-coding.lifestyle</span>
            </div>
            <p>Transforming coding from a job into a lifestyle. Join the global movement of creative developers.</p>
            <p className="company-info">A product of <strong>Absolute Dimension Pvt Ltd</strong></p>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Lifestyle</h4>
            <ul>
              <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
              <li><a href="#features" onClick={() => scrollToSection('features')}>Features</a></li>
              <li><a href="#curriculum" onClick={() => scrollToSection('curriculum')}>Journey</a></li>
              <li><a href="#pricing" onClick={() => scrollToSection('pricing')}>Tiers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><a href="#">Vibe Blog</a></li>
              <li><a href="#">Lifestyle Tips</a></li>
              <li><a href="#">Success Stories</a></li>
              <li><a href="#">Global Events</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/webinar">Webinar</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/cancellation-refund">Cancellation/Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 vibe-coding.lifestyle. Join the movement. Live the vibe.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 