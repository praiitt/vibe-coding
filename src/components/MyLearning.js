import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MyLearning = ({ showNotification }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadEnrollments();
    }
  }, [user]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyEnrollments();
      setEnrollments(response.enrollments || []);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      showNotification('Failed to load your courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'active': return '#007bff';
      case 'paused': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="my-learning-loading">
        <div className="loading-spinner"></div>
        <p>Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="my-learning">
      <div className="learning-header">
        <h2>My Learning</h2>
        <p>Continue your learning journey</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="no-enrollments">
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h3>No courses enrolled yet</h3>
            <p>Start your learning journey by enrolling in a course</p>
            <Link to="/courses" className="browse-courses-btn">
              Browse Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="enrollments-grid">
          {enrollments.map((enrollment) => {
            const course = enrollment.courseId;
            if (!course) return null;

            return (
              <div key={enrollment._id} className="enrollment-card">
                {course.thumbnailUrl && (
                  <div className="course-thumbnail">
                    <img src={course.thumbnailUrl} alt={course.title} />
                    <div className="progress-overlay">
                      <div className="circular-progress">
                        <svg className="progress-ring" width="60" height="60">
                          <circle
                            className="progress-ring-circle"
                            stroke="#e6e6e6"
                            strokeWidth="4"
                            fill="transparent"
                            r="26"
                            cx="30"
                            cy="30"
                          />
                          <circle
                            className="progress-ring-circle progress-ring-circle-fill"
                            stroke="#007bff"
                            strokeWidth="4"
                            fill="transparent"
                            r="26"
                            cx="30"
                            cy="30"
                            strokeDasharray={`${2 * Math.PI * 26}`}
                            strokeDashoffset={`${2 * Math.PI * 26 * (1 - (enrollment.progressPercent || 0) / 100)}`}
                          />
                        </svg>
                        <div className="progress-text">
                          {enrollment.progressPercent || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="enrollment-content">
                  <div className="course-info">
                    <h3 className="course-title">{course.title}</h3>
                    
                    <div className="enrollment-meta">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(enrollment.status) }}
                      >
                        {enrollment.status}
                      </span>
                      
                      <span className="enrolled-date">
                        Enrolled {formatDate(enrollment.startedAt)}
                      </span>
                    </div>

                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${enrollment.progressPercent || 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="progress-info">
                      <span>{enrollment.progressPercent || 0}% complete</span>
                      {enrollment.status === 'completed' && enrollment.completedAt && (
                        <span className="completion-date">
                          Completed {formatDate(enrollment.completedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="enrollment-actions">
                    <Link 
                      to={`/learn/${course.slug}`}
                      className="continue-btn"
                    >
                      {enrollment.progressPercent === 0 ? 'Start Learning' : 'Continue'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {enrollments.length > 0 && (
        <div className="learning-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <h4>{enrollments.length}</h4>
              <p>Courses Enrolled</p>
            </div>
            
            <div className="stat-item">
              <h4>{enrollments.filter(e => e.status === 'completed').length}</h4>
              <p>Courses Completed</p>
            </div>
            
            <div className="stat-item">
              <h4>{enrollments.filter(e => e.status === 'active').length}</h4>
              <p>In Progress</p>
            </div>
            
            <div className="stat-item">
              <h4>
                {Math.round(
                  enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) / enrollments.length
                )}%
              </h4>
              <p>Average Progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
