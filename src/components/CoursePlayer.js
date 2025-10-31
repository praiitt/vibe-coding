import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CoursePlayer = ({ showNotification }) => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      loadCourseData();
    }
  }, [slug]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      // Load course and progress in parallel
      const [courseResponse, progressResponse] = await Promise.all([
        apiService.getCourse(slug),
        apiService.getProgress(slug).catch(() => ({ progress: null })) // Progress might not exist yet
      ]);
      
      setCourse(courseResponse.course);
      setProgress(progressResponse.progress);
      
      // Set current lesson from progress or start from beginning
      if (progressResponse.progress?.lastActivity) {
        const { moduleId, lessonId } = progressResponse.progress.lastActivity;
        const moduleIndex = courseResponse.course.modules.findIndex(m => m._id === moduleId);
        const lessonIndex = courseResponse.course.modules[moduleIndex]?.lessons.findIndex(l => l._id === lessonId);
        
        if (moduleIndex >= 0 && lessonIndex >= 0) {
          setCurrentModule(moduleIndex);
          setCurrentLesson(lessonIndex);
        }
      }
      
    } catch (error) {
      console.error('Error loading course:', error);
      showNotification('Failed to load course', 'error');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (completed = false, score = null, timeSpent = 0) => {
    if (!course || !user) return;

    const currentModuleData = course.modules[currentModule];
    const currentLessonData = currentModuleData?.lessons[currentLesson];
    
    if (!currentModuleData || !currentLessonData) return;

    try {
      const progressData = {
        courseId: course._id,
        moduleId: currentModuleData._id,
        lessonId: currentLessonData._id,
        completed,
        score,
        timeSpentSeconds: timeSpent
      };

      const response = await apiService.updateProgress(progressData);
      setProgress(response.progress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const markLessonComplete = async () => {
    await updateProgress(true, null, 0);
    showNotification('Lesson marked as complete!', 'success');
  };

  const navigateToLesson = (moduleIndex, lessonIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
    // Track visit
    updateProgress(false, null, 0);
  };

  const nextLesson = () => {
    const currentModuleData = course.modules[currentModule];
    
    if (currentLesson < currentModuleData.lessons.length - 1) {
      // Next lesson in same module
      navigateToLesson(currentModule, currentLesson + 1);
    } else if (currentModule < course.modules.length - 1) {
      // First lesson of next module
      navigateToLesson(currentModule + 1, 0);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      // Previous lesson in same module
      navigateToLesson(currentModule, currentLesson - 1);
    } else if (currentModule > 0) {
      // Last lesson of previous module
      const prevModuleData = course.modules[currentModule - 1];
      navigateToLesson(currentModule - 1, prevModuleData.lessons.length - 1);
    }
  };

  const isLessonCompleted = (moduleId, lessonId) => {
    if (!progress?.activities) return false;
    return progress.activities.some(
      activity => activity.moduleId === moduleId && 
                 activity.lessonId === lessonId && 
                 activity.completed
    );
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={index} className="content-block text-block">
            <div dangerouslySetInnerHTML={{ __html: block.data.html || block.data.text }} />
          </div>
        );
      
      case 'video':
        return (
          <div key={index} className="content-block video-block">
            {block.data.youtubeId ? (
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${block.data.youtubeId}`}
                  title="Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ) : block.data.url ? (
              <video controls className="video-player">
                <source src={block.data.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Video not available</p>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div key={index} className="content-block image-block">
            <img src={block.data.url} alt={block.data.alt || 'Course image'} />
            {block.data.caption && <p className="image-caption">{block.data.caption}</p>}
          </div>
        );
      
      default:
        return (
          <div key={index} className="content-block">
            <p>Unsupported content type: {block.type}</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="course-player-loading">
        <div className="loading-spinner"></div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  const currentModuleData = course.modules[currentModule];
  const currentLessonData = currentModuleData?.lessons[currentLesson];
  const hasNextLesson = currentLesson < currentModuleData?.lessons.length - 1 || currentModule < course.modules.length - 1;
  const hasPrevLesson = currentLesson > 0 || currentModule > 0;

  return (
    <div className="course-player">
      {/* Sidebar */}
      <div className={`course-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>{course.title}</h3>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        <div className="progress-overview">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress?.overallPercent || 0}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress?.overallPercent || 0}% Complete</span>
        </div>

        <div className="course-modules">
          {course.modules.map((module, moduleIndex) => (
            <div key={module._id} className="module-section">
              <h4 className="module-title">{module.title}</h4>
              <ul className="lessons-list">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lesson._id}>
                    <button
                      className={`lesson-item ${
                        moduleIndex === currentModule && lessonIndex === currentLesson ? 'active' : ''
                      } ${isLessonCompleted(module._id, lesson._id) ? 'completed' : ''}`}
                      onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                    >
                      <i className={`fas ${isLessonCompleted(module._id, lesson._id) ? 'fa-check-circle' : 'fa-play-circle'}`}></i>
                      <span>{lesson.title}</span>
                      {lesson.durationSeconds > 0 && (
                        <span className="lesson-duration">
                          {Math.ceil(lesson.durationSeconds / 60)}m
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="course-content">
        <div className="lesson-header">
          <div className="lesson-info">
            <h1>{currentLessonData?.title}</h1>
            <div className="lesson-meta">
              <span>Module {currentModule + 1}: {currentModuleData?.title}</span>
              <span>Lesson {currentLesson + 1} of {currentModuleData?.lessons.length}</span>
            </div>
          </div>
          
          <div className="lesson-actions">
            <button
              className="complete-btn"
              onClick={markLessonComplete}
              disabled={isLessonCompleted(currentModuleData._id, currentLessonData._id)}
            >
              {isLessonCompleted(currentModuleData._id, currentLessonData._id) ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>

        <div className="lesson-content">
          {currentLessonData?.videoUrl && (
            <div className="lesson-video">
              <video controls className="main-video">
                <source src={currentLessonData.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {currentLessonData?.youtubeId && (
            <div className="lesson-video">
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${currentLessonData.youtubeId}`}
                  title={currentLessonData.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {currentLessonData?.contentBlocks?.map((block, index) => renderContentBlock(block, index))}
        </div>

        <div className="lesson-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={prevLesson}
            disabled={!hasPrevLesson}
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          
          <button
            className="nav-btn next-btn"
            onClick={nextLesson}
            disabled={!hasNextLesson}
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
