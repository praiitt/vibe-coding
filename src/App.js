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
import ScrollToTop from './components/ScrollToTop';
import WebinarLanding from './pages/WebinarLanding';
import WebinarRegister from './pages/WebinarRegister';
import WebinarSuccess from './pages/WebinarSuccess';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationRefundPolicy from './pages/CancellationRefundPolicy';
import ProtectedRoute from './components/ProtectedRoute';
import LinkedInSuccess from './pages/LinkedInSuccess';
// LMS Components
import CourseCatalog from './components/CourseCatalog';
import CoursePlayer from './components/CoursePlayer';
import MyLearning from './components/MyLearning';
import AdminDashboard from './components/AdminDashboard';
import CourseAuthor from './components/CourseAuthor';
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
      <ScrollToTop />
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
          <Route path="/linkedin-success" element={<LinkedInSuccess showNotification={showNotification} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
          
          {/* LMS Routes */}
          <Route path="/courses" element={<CourseCatalog showNotification={showNotification} />} />
          <Route path="/my-learning" element={
            <ProtectedRoute>
              <MyLearning showNotification={showNotification} />
            </ProtectedRoute>
          } />
          <Route path="/learn/:slug" element={
            <ProtectedRoute>
              <CoursePlayer showNotification={showNotification} />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/courses" element={
            <ProtectedRoute>
              <AdminDashboard showNotification={showNotification} />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/new" element={
            <ProtectedRoute>
              <CourseAuthor showNotification={showNotification} />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses/:courseId/edit" element={
            <ProtectedRoute>
              <CourseAuthor showNotification={showNotification} />
            </ProtectedRoute>
          } />
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