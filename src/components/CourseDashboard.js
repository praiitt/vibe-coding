import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { apiService } from '../services/api';

const CourseDashboard = ({ user, showNotification }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [userProgress, setUserProgress] = useState({});
  const [currentCourse, setCurrentCourse] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProgress();
      loadRegisteredCourses();
    }
  }, [user]);

  const loadUserProgress = async () => {
    try {
      // For now, return empty progress since we don't have course progress API yet
      // This can be implemented later when course progress tracking is needed
      setUserProgress({});
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const loadRegisteredCourses = async () => {
    try {
      const response = await apiService.getMyCourses();
      setRegisteredCourses(response.courses || []);
    } catch (error) {
      console.error('Error loading registered courses:', error);
    }
  };

  const courses = [
    {
      id: 'vibe-foundations',
      title: 'Vibe Coding Foundations',
      description: 'Master the fundamentals of creative programming',
      duration: '4 weeks',
      lessons: 12,
      level: 'Beginner',
      image: '🎨',
      progress: userProgress['vibe-foundations'] || 0,
      modules: [
        {
          id: 'mindset',
          title: 'Mindset Transformation',
          lessons: 3,
          completed: 0
        },
        {
          id: 'basics',
          title: 'Creative Programming Basics',
          lessons: 4,
          completed: 0
        },
        {
          id: 'rhythm',
          title: 'Rhythm & Flow',
          lessons: 3,
          completed: 0
        },
        {
          id: 'projects',
          title: 'First Creative Projects',
          lessons: 2,
          completed: 0
        }
      ]
    },
    {
      id: 'visual-vibes',
      title: 'Visual Vibes & Animations',
      description: 'Create stunning visual effects and animations',
      duration: '6 weeks',
      lessons: 18,
      level: 'Intermediate',
      image: '✨',
      progress: userProgress['visual-vibes'] || 0,
      modules: [
        {
          id: 'canvas',
          title: 'Creative Canvas Programming',
          lessons: 4,
          completed: 0
        },
        {
          id: 'animations',
          title: 'Smooth Animations',
          lessons: 5,
          completed: 0
        },
        {
          id: 'effects',
          title: 'Visual Effects',
          lessons: 4,
          completed: 0
        },
        {
          id: 'interactive',
          title: 'Interactive Graphics',
          lessons: 5,
          completed: 0
        }
      ]
    },
    {
      id: 'audio-vibes',
      title: 'Audio Vibes & Music Programming',
      description: 'Code with rhythm and create generative music',
      duration: '8 weeks',
      lessons: 24,
      level: 'Advanced',
      image: '🎵',
      progress: userProgress['audio-vibes'] || 0,
      modules: [
        {
          id: 'synthesis',
          title: 'Sound Synthesis',
          lessons: 6,
          completed: 0
        },
        {
          id: 'rhythm',
          title: 'Rhythm Programming',
          lessons: 5,
          completed: 0
        },
        {
          id: 'generative',
          title: 'Generative Music',
          lessons: 6,
          completed: 0
        },
        {
          id: 'visualization',
          title: 'Audio Visualization',
          lessons: 7,
          completed: 0
        }
      ]
    },
    {
      id: 'lifestyle-mastery',
      title: 'Vibe Coding Lifestyle Mastery',
      description: 'Transform coding into your dream lifestyle',
      duration: '10 weeks',
      lessons: 30,
      level: 'Expert',
      image: '🌟',
      progress: userProgress['lifestyle-mastery'] || 0,
      modules: [
        {
          id: 'remote',
          title: 'Remote Work Lifestyle',
          lessons: 6,
          completed: 0
        },
        {
          id: 'community',
          title: 'Building Communities',
          lessons: 5,
          completed: 0
        },
        {
          id: 'branding',
          title: 'Personal Branding',
          lessons: 4,
          completed: 0
        },
        {
          id: 'business',
          title: 'Creative Business',
          lessons: 5,
          completed: 0
        },
        {
          id: 'mentorship',
          title: 'Mentorship & Leadership',
          lessons: 5,
          completed: 0
        },
        {
          id: 'future',
          title: 'Future of Vibe Coding',
          lessons: 5,
          completed: 0
        }
      ]
    }
  ];

  const handleCourseSelect = async (course) => {
    const isRegistered = registeredCourses.some(reg => reg.courseId === course.id);
    
    if (isRegistered) {
      setCurrentCourse(course);
      showNotification(`Opening ${course.title}`, 'info');
    } else {
      await handleCourseRegistration(course);
    }
  };

  const handleCourseRegistration = async (course) => {
    setIsRegistering(true);
    try {
      await apiService.registerForCourse(course.id, course.title);
      showNotification(`🎉 Successfully registered for ${course.title}! We'll get back to you soon with course details.`, 'success');
      await loadRegisteredCourses(); // Refresh the registered courses list
    } catch (error) {
      console.error('Error registering for course:', error);
      showNotification(`❌ Failed to register for ${course.title}. Please try again.`, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#4ecdc4';
    if (progress >= 50) return '#ffd93d';
    return '#ff6b6b';
  };

  return (
    <div className="course-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Your Vibe Coding Journey</h1>
          <p>Welcome back, {user?.name || 'Vibe Coder'}! Ready to create some magic?</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{courses.length}</h3>
              <p>Courses Available</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{Object.values(userProgress).reduce((sum, p) => sum + p, 0)}%</h3>
              <p>Overall Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{courses.reduce((sum, c) => sum + c.lessons, 0)}</h3>
              <p>Total Lessons</p>
            </div>
          </div>
        </div>

        <div className="courses-grid" ref={ref}>
          {courses.map((course, index) => (
            <div 
              key={course.id}
              className="course-card"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
              }}
            >
              <div className="course-header">
                <div className="course-icon">{course.image}</div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  {registeredCourses.some(reg => reg.courseId === course.id) && (
                    <div className="registration-status">
                      <i className="fas fa-check-circle"></i>
                      <span>Registered - We'll contact you soon!</span>
                    </div>
                  )}
                  <div className="course-meta">
                    <span className="level">{course.level}</span>
                    <span className="duration">{course.duration}</span>
                    <span className="lessons">{course.lessons} lessons</span>
                  </div>
                </div>
              </div>

              <div className="course-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${course.progress}%`,
                      backgroundColor: getProgressColor(course.progress)
                    }}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}% Complete</span>
              </div>

              <div className="course-modules">
                <h4>Modules:</h4>
                <ul>
                  {course.modules.map(module => (
                    <li key={module.id}>
                      <span className="module-title">{module.title}</span>
                      <span className="module-lessons">{module.lessons} lessons</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => handleCourseSelect(course)}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Registering...
                  </>
                ) : registeredCourses.some(reg => reg.courseId === course.id) ? 'Continue Learning' : 'Register Course'}
              </button>
            </div>
          ))}
        </div>

        {currentCourse && (
          <div className="course-modal">
            <div className="modal-content">
              <h2>{currentCourse.title}</h2>
              <p>{currentCourse.description}</p>
              {/* Course content will be loaded here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDashboard; 