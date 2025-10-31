import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CourseAuthor = ({ showNotification }) => {
  const [course, setCourse] = useState({
    title: '',
    slug: '',
    description: '',
    level: 'beginner',
    language: 'en',
    thumbnailUrl: '',
    promoVideoUrl: '',
    priceInPaise: 0,
    isPublished: false,
    modules: [],
    tags: []
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [aiGenerating, setAiGenerating] = useState(false);
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!courseId;

  useEffect(() => {
    if (isEditing) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      // Note: This will need to be updated to use course ID instead of slug
      const response = await apiService.getCourse(courseId);
      setCourse(response.course);
    } catch (error) {
      console.error('Error loading course:', error);
      showNotification('Failed to load course', 'error');
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field, value) => {
    setCourse(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && !isEditing) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleTagsChange = (value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setCourse(prev => ({ ...prev, tags }));
  };

  const addModule = () => {
    const newModule = {
      _id: `temp_${Date.now()}`,
      title: 'New Module',
      order: course.modules.length,
      lessons: []
    };
    
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const updateModule = (moduleIndex, field, value) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) => 
        index === moduleIndex ? { ...module, [field]: value } : module
      )
    }));
  };

  const deleteModule = (moduleIndex) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.filter((_, index) => index !== moduleIndex)
      }));
    }
  };

  const addLesson = (moduleIndex) => {
    const newLesson = {
      _id: `temp_${Date.now()}`,
      title: 'New Lesson',
      order: course.modules[moduleIndex].lessons.length,
      durationSeconds: 0,
      videoUrl: '',
      youtubeId: '',
      contentBlocks: []
    };

    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) => 
        index === moduleIndex 
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    }));
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map((module, mIndex) => 
        mIndex === moduleIndex 
          ? {
              ...module,
              lessons: module.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : module
      )
    }));
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map((module, mIndex) => 
          mIndex === moduleIndex 
            ? {
                ...module,
                lessons: module.lessons.filter((_, lIndex) => lIndex !== lessonIndex)
              }
            : module
        )
      }));
    }
  };

  const generateContent = async (type, prompt) => {
    try {
      setAiGenerating(true);
      
      let response;
      if (type === 'text') {
        response = await apiService.generateText(prompt);
        return response.text;
      } else if (type === 'image') {
        response = await apiService.generateImage(prompt);
        return response.imageUrl;
      }
    } catch (error) {
      console.error('AI generation error:', error);
      showNotification('AI generation failed', 'error');
      return null;
    } finally {
      setAiGenerating(false);
    }
  };

  const generateCourseDescription = async () => {
    if (!course.title) {
      showNotification('Please enter a course title first', 'error');
      return;
    }

    const prompt = `Generate a compelling course description for: "${course.title}". Include what students will learn, prerequisites, and target audience. Keep it engaging and informative.`;
    const description = await generateContent('text', prompt);
    
    if (description) {
      handleInputChange('description', description);
      showNotification('Course description generated!', 'success');
    }
  };

  const saveCourse = async () => {
    try {
      setSaving(true);
      
      if (!course.title || !course.slug) {
        showNotification('Title and slug are required', 'error');
        return;
      }

      let response;
      if (isEditing) {
        response = await apiService.updateCourse(courseId, course);
      } else {
        response = await apiService.createCourse(course);
      }

      showNotification(
        `Course ${isEditing ? 'updated' : 'created'} successfully!`, 
        'success'
      );

      if (!isEditing) {
        navigate(`/admin/courses/${response.course._id}/edit`);
      }
    } catch (error) {
      console.error('Save course error:', error);
      showNotification(error.message || 'Failed to save course', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="course-author-loading">
        <div className="loading-spinner"></div>
        <p>Loading course...</p>
      </div>
    );
  }

  return (
    <div className="course-author">
      <div className="author-header">
        <h1>{isEditing ? 'Edit Course' : 'Create New Course'}</h1>
        <div className="author-actions">
          <button 
            className="save-btn"
            onClick={saveCourse}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Course'}
          </button>
        </div>
      </div>

      <div className="author-tabs">
        <button 
          className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Course Content
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="author-content">
        {activeTab === 'basic' && (
          <div className="basic-info-tab">
            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title"
              />
            </div>

            <div className="form-group">
              <label>Course Slug *</label>
              <input
                type="text"
                value={course.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="course-slug"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <div className="description-container">
                <textarea
                  value={course.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter course description"
                  rows={6}
                />
                <button 
                  className="ai-generate-btn"
                  onClick={generateCourseDescription}
                  disabled={aiGenerating}
                >
                  {aiGenerating ? '🤖 Generating...' : '🤖 Generate with AI'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Level</label>
                <select
                  value={course.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Language</label>
                <select
                  value={course.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Price (in ₹)</label>
              <input
                type="number"
                value={course.priceInPaise / 100}
                onChange={(e) => handleInputChange('priceInPaise', e.target.value * 100)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Thumbnail URL</label>
              <input
                type="url"
                value={course.thumbnailUrl}
                onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div className="form-group">
              <label>Promo Video URL</label>
              <input
                type="url"
                value={course.promoVideoUrl}
                onChange={(e) => handleInputChange('promoVideoUrl', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={course.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="javascript, react, frontend"
              />
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-tab">
            <div className="content-header">
              <h3>Course Modules</h3>
              <button className="add-module-btn" onClick={addModule}>
                + Add Module
              </button>
            </div>

            {course.modules.map((module, moduleIndex) => (
              <div key={module._id} className="module-editor">
                <div className="module-header">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    className="module-title-input"
                  />
                  <button 
                    className="delete-btn"
                    onClick={() => deleteModule(moduleIndex)}
                  >
                    🗑️
                  </button>
                </div>

                <div className="lessons-container">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lesson._id} className="lesson-editor">
                      <div className="lesson-header">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                          className="lesson-title-input"
                        />
                        <button 
                          className="delete-btn"
                          onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="lesson-fields">
                        <div className="form-group">
                          <label>Video URL</label>
                          <input
                            type="url"
                            value={lesson.videoUrl}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>

                        <div className="form-group">
                          <label>YouTube ID</label>
                          <input
                            type="text"
                            value={lesson.youtubeId}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'youtubeId', e.target.value)}
                            placeholder="dQw4w9WgXcQ"
                          />
                        </div>

                        <div className="form-group">
                          <label>Duration (minutes)</label>
                          <input
                            type="number"
                            value={Math.ceil(lesson.durationSeconds / 60)}
                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'durationSeconds', e.target.value * 60)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    className="add-lesson-btn"
                    onClick={() => addLesson(moduleIndex)}
                  >
                    + Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={course.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                />
                <span className="checkbox-text">Published (visible to students)</span>
              </label>
            </div>

            <div className="danger-zone">
              <h4>Danger Zone</h4>
              <p>Once you delete a course, there is no going back. Please be certain.</p>
              <button className="danger-btn">Delete Course</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseAuthor;
