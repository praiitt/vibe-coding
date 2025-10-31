import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CourseCatalog = ({ showNotification }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCourses();
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      showNotification('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    if (!user) {
      showNotification('Please login to enroll in courses', 'error');
      return;
    }

    try {
      setEnrolling(prev => ({ ...prev, [course._id]: true }));
      await apiService.enrollInCourse(course._id);
      showNotification(`Successfully enrolled in ${course.title}!`, 'success');
      // Navigate to course player
      navigate(`/learn/${course.slug}`);
    } catch (error) {
      console.error('Error enrolling:', error);
      showNotification(error.message || 'Failed to enroll in course', 'error');
    } finally {
      setEnrolling(prev => ({ ...prev, [course._id]: false }));
    }
  };

  const formatPrice = (priceInPaise) => {
    if (!priceInPaise || priceInPaise === 0) return 'Free';
    return `₹${(priceInPaise / 100).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="course-catalog-loading">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="course-catalog">
      <div className="catalog-header">
        <h2>Available Courses</h2>
        <p>Choose from our comprehensive collection of programming courses</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <h3>No courses available yet</h3>
          <p>Check back soon for new courses!</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              {course.thumbnailUrl && (
                <div className="course-thumbnail">
                  <img src={course.thumbnailUrl} alt={course.title} />
                </div>
              )}
              
              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <span className={`course-level level-${course.level}`}>
                    {course.level}
                  </span>
                </div>
                
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <span className="course-modules">
                    {course.modules?.length || 0} modules
                  </span>
                  <span className="course-lessons">
                    {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} lessons
                  </span>
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div className="course-tags">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="course-tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="course-footer">
                  <div className="course-price">
                    {formatPrice(course.priceInPaise)}
                  </div>
                  
                  <button
                    className="enroll-btn"
                    onClick={() => handleEnroll(course)}
                    disabled={enrolling[course._id]}
                  >
                    {enrolling[course._id] ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
