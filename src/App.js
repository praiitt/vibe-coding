import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Curriculum from './components/Curriculum';
import Footer from './components/Footer';
import CourseDashboard from './components/CourseDashboard';
import CourseContent from './components/CourseContent';
import SubscriptionManager from './components/SubscriptionManager';
import LoginModal from './components/LoginModal';
import Notification from './components/Notification';
import WebinarLanding from './pages/WebinarLanding';
import WebinarRegister from './pages/WebinarRegister';
import WebinarSuccess from './pages/WebinarSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { useNotification } from './hooks/useNotification';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { notification, showNotification, hideNotification } = useNotification();
  const { currentUser } = useAuth();
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar onLoginClick={() => setShowLoginModal(true)} />
        
        <Routes>
          <Route path="/" element={
            <>
              <Hero showNotification={showNotification} />
              <Features />
              <Curriculum />
            </>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CourseDashboard 
                user={currentUser} 
                showNotification={showNotification}
                onCourseSelect={setCurrentCourse}
              />
            </ProtectedRoute>
          } />
          <Route path="/course/:courseId" element={
            <ProtectedRoute>
              <CourseContent 
                course={currentCourse}
                user={currentUser}
                showNotification={showNotification}
                onBack={() => setCurrentCourse(null)}
              />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={
            <ProtectedRoute>
              <SubscriptionManager 
                user={currentUser}
                showNotification={showNotification}
                onSubscriptionChange={() => {}}
              />
            </ProtectedRoute>
          } />
          <Route path="/webinar" element={<WebinarLanding />} />
          <Route path="/webinar/register" element={<WebinarRegister />} />
          <Route path="/webinar/success" element={<WebinarSuccess />} />
        </Routes>
        
        <Footer />
        
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          showNotification={showNotification}
        />
        
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        )}
      </div>
    </Router>
  );
}

export default App; 