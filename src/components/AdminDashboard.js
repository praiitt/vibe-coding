import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = ({ showNotification }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // Include unpublished courses for admin
      const response = await apiService.getCourses(true);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      showNotification('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(prev => ({ ...prev, [courseId]: true }));
      await apiService.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course._id !== courseId));
      showNotification('Course deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('Failed to delete course', 'error');
    } finally {
      setDeleting(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const togglePublish = async (course) => {
    try {
      const updatedCourse = { ...course, isPublished: !course.isPublished };
      await apiService.updateCourse(course._id, { isPublished: updatedCourse.isPublished });
      
      setCourses(prev => prev.map(c => 
        c._id === course._id ? updatedCourse : c
      ));
      
      showNotification(
        `Course ${updatedCourse.isPublished ? 'published' : 'unpublished'} successfully`,
        'success'
      );
    } catch (error) {
      console.error('Error updating course:', error);
      showNotification('Failed to update course', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (priceInPaise) => {
    if (!priceInPaise || priceInPaise === 0) return 'Free';
    return `₹${(priceInPaise / 100).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Course Management</h1>
          <p>Manage your courses and content</p>
        </div>
        <Link to="/admin/courses/new" className="create-course-btn">
          + Create New Course
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{courses.length}</h3>
          <p>Total Courses</p>
        </div>
        <div className="stat-card">
          <h3>{courses.filter(c => c.isPublished).length}</h3>
          <p>Published</p>
        </div>
        <div className="stat-card">
          <h3>{courses.filter(c => !c.isPublished).length}</h3>
          <p>Drafts</p>
        </div>
        <div className="stat-card">
          <h3>{courses.filter(c => c.priceInPaise > 0).length}</h3>
          <p>Paid Courses</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h3>No courses created yet</h3>
            <p>Create your first course to get started</p>
            <Link to="/admin/courses/new" className="create-first-course-btn">
              Create Your First Course
            </Link>
          </div>
        </div>
      ) : (
        <div className="courses-table">
          <div className="table-header">
            <div className="header-cell">Course</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Level</div>
            <div className="header-cell">Price</div>
            <div className="header-cell">Modules</div>
            <div className="header-cell">Created</div>
            <div className="header-cell">Actions</div>
          </div>

          {courses.map((course) => (
            <div key={course._id} className="table-row">
              <div className="cell course-cell">
                <div className="course-info">
                  {course.thumbnailUrl && (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="course-thumbnail"
                    />
                  )}
                  <div className="course-details">
                    <h4>{course.title}</h4>
                    <p className="course-slug">/{course.slug}</p>
                  </div>
                </div>
              </div>

              <div className="cell">
                <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="cell">
                <span className={`level-badge level-${course.level}`}>
                  {course.level}
                </span>
              </div>

              <div className="cell">
                <span className="price">
                  {formatPrice(course.priceInPaise)}
                </span>
              </div>

              <div className="cell">
                <span className="modules-count">
                  {course.modules?.length || 0} modules
                </span>
              </div>

              <div className="cell">
                <span className="date">
                  {formatDate(course.createdAt)}
                </span>
              </div>

              <div className="cell actions-cell">
                <div className="action-buttons">
                  <Link 
                    to={`/admin/courses/${course._id}/edit`}
                    className="action-btn edit-btn"
                    title="Edit Course"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>

                  <button
                    className={`action-btn ${course.isPublished ? 'unpublish-btn' : 'publish-btn'}`}
                    onClick={() => togglePublish(course)}
                    title={course.isPublished ? 'Unpublish Course' : 'Publish Course'}
                  >
                    <i className={`fas ${course.isPublished ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>

                  <Link 
                    to={`/courses/${course.slug}`}
                    className="action-btn preview-btn"
                    title="Preview Course"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </Link>

                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteCourse(course._id, course.title)}
                    disabled={deleting[course._id]}
                    title="Delete Course"
                  >
                    {deleting[course._id] ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
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

export default AdminDashboard;
