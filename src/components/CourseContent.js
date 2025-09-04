import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CourseContent = ({ course, user, showNotification, onBack }) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonProgress, setLessonProgress] = useState({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const courseContent = {
    'vibe-foundations': {
      modules: [
        {
          id: 'mindset',
          title: 'Mindset Transformation',
          description: 'Shift from job mentality to lifestyle mentality',
          lessons: [
            {
              id: 'mindset-1',
              title: 'What is Vibe Coding?',
              duration: '15 min',
              type: 'video',
              content: {
                videoUrl: 'https://example.com/videos/vibe-coding-intro.mp4',
                description: 'Introduction to the concept of vibe coding and how it differs from traditional programming.',
                keyPoints: [
                  'Understanding creative programming',
                  'The difference between job and lifestyle',
                  'Embracing creativity in code'
                ],
                codeExample: `// Traditional approach
function calculateSum(a, b) {
  return a + b;
}

// Vibe coding approach
function createVibe() {
  const rhythm = getCurrentBeat();
  const creativity = generateInspiration();
  return rhythm + creativity;
}`,
                exercises: [
                  {
                    title: 'Reflection Exercise',
                    description: 'Think about your current relationship with coding. How does it make you feel?',
                    type: 'reflection'
                  }
                ]
              }
            },
            {
              id: 'mindset-2',
              title: 'The Creative Developer Mindset',
              duration: '20 min',
              type: 'video',
              content: {
                videoUrl: 'https://example.com/videos/creative-mindset.mp4',
                description: 'Developing the mindset of a creative developer who sees code as art.',
                keyPoints: [
                  'Viewing code as expression',
                  'Finding joy in creation',
                  'Building sustainable habits'
                ],
                codeExample: `// Expressing emotions through code
const mood = getCurrentMood();
const colors = {
  happy: ['#FFD93D', '#4ECDC4', '#45B7D1'],
  calm: ['#96CEB4', '#FFEAA7', '#DDA0DD'],
  energetic: ['#FF6B6B', '#FF8E53', '#FFA726']
};

function createMoodVisualization() {
  return colors[mood].map(color => 
    createVisualElement(color, mood)
  );
}`,
                exercises: [
                  {
                    title: 'Mood Coding Exercise',
                    description: 'Write a function that changes based on your current mood.',
                    type: 'coding'
                  }
                ]
              }
            },
            {
              id: 'mindset-3',
              title: 'Building Your Coding Rhythm',
              duration: '25 min',
              type: 'interactive',
              content: {
                description: 'Learn to develop your own unique coding rhythm and flow.',
                keyPoints: [
                  'Finding your optimal coding time',
                  'Creating a conducive environment',
                  'Building momentum and flow'
                ],
                interactiveElements: [
                  {
                    type: 'rhythm-tracker',
                    title: 'Track Your Coding Rhythm',
                    description: 'Monitor your energy levels and productivity patterns'
                  }
                ],
                exercises: [
                  {
                    title: 'Rhythm Assessment',
                    description: 'Identify your peak coding hours and energy patterns.',
                    type: 'assessment'
                  }
                ]
              }
            }
          ]
        },
        {
          id: 'basics',
          title: 'Creative Programming Basics',
          description: 'Master the fundamentals with a creative approach',
          lessons: [
            {
              id: 'basics-1',
              title: 'Variables as Story Elements',
              duration: '18 min',
              type: 'video',
              content: {
                videoUrl: 'https://example.com/videos/variables-story.mp4',
                description: 'Think of variables as characters in your code story.',
                keyPoints: [
                  'Naming variables with meaning',
                  'Creating readable code stories',
                  'Using variables to express intent'
                ],
                codeExample: `// Boring variable names
let x = 10;
let y = 20;
let z = x + y;

// Creative, meaningful names
let creativeEnergy = 10;
let inspirationLevel = 20;
let totalVibe = creativeEnergy + inspirationLevel;

// Even more expressive
let morningCreativity = 10;
let afternoonInspiration = 20;
let dailyVibeScore = morningCreativity + afternoonInspiration;`,
                exercises: [
                  {
                    title: 'Story Variables',
                    description: 'Rewrite a piece of code using variables that tell a story.',
                    type: 'coding'
                  }
                ]
              }
            },
            {
              id: 'basics-2',
              title: 'Functions as Creative Tools',
              duration: '22 min',
              type: 'video',
              content: {
                videoUrl: 'https://example.com/videos/functions-creative.mp4',
                description: 'Transform functions into creative tools for expression.',
                keyPoints: [
                  'Functions as artistic expressions',
                  'Creating reusable creative patterns',
                  'Building your creative toolkit'
                ],
                codeExample: `// Creative function examples
function createVibeMood(mood, intensity) {
  const colors = getMoodColors(mood);
  const animation = getMoodAnimation(intensity);
  return { colors, animation, mood };
}

function generateCreativePattern(style, complexity) {
  const elements = [];
  for (let i = 0; i < complexity; i++) {
    elements.push(createCreativeElement(style, i));
  }
  return elements;
}

function expressEmotion(emotion) {
  const expression = {
    joy: () => createJoyfulAnimation(),
    calm: () => createCalmVisualization(),
    energy: () => createEnergeticPattern()
  };
  return expression[emotion]();
}`,
                exercises: [
                  {
                    title: 'Creative Function Workshop',
                    description: 'Create a function that expresses an emotion or mood.',
                    type: 'coding'
                  }
                ]
              }
            },
            {
              id: 'basics-3',
              title: 'Loops and Repetition in Art',
              duration: '20 min',
              type: 'interactive',
              content: {
                description: 'Use loops to create beautiful patterns and repetitive art.',
                keyPoints: [
                  'Creating patterns with loops',
                  'Using repetition artistically',
                  'Building complex visuals from simple loops'
                ],
                interactiveElements: [
                  {
                    type: 'pattern-generator',
                    title: 'Pattern Generator',
                    description: 'Create beautiful patterns using loops'
                  }
                ],
                codeExample: `// Creating a spiral pattern
function createSpiral(radius, steps) {
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i * Math.PI * 2) / steps;
    const distance = (i / steps) * radius;
    points.push({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });
  }
  return points;
}

// Creating a wave pattern
function createWave(amplitude, frequency, points) {
  const wave = [];
  for (let i = 0; i < points; i++) {
    const x = (i / points) * Math.PI * 2;
    const y = Math.sin(x * frequency) * amplitude;
    wave.push({ x: i, y: y });
  }
  return wave;
}`,
                exercises: [
                  {
                    title: 'Pattern Creation',
                    description: 'Create a unique pattern using loops.',
                    type: 'coding'
                  }
                ]
              }
            },
            {
              id: 'basics-4',
              title: 'Conditionals and Creative Decisions',
              duration: '16 min',
              type: 'video',
              content: {
                videoUrl: 'https://example.com/videos/conditionals-creative.mp4',
                description: 'Use conditionals to make creative decisions in your code.',
                keyPoints: [
                  'Making artistic choices with code',
                  'Creating dynamic behaviors',
                  'Building responsive creative systems'
                ],
                codeExample: `// Creative decision making
function createArtwork(timeOfDay, weather, mood) {
  let style = 'default';
  
  if (timeOfDay === 'sunrise' && weather === 'clear') {
    style = 'warm_golden';
  } else if (timeOfDay === 'night' && weather === 'clear') {
    style = 'cosmic_starry';
  } else if (mood === 'energetic') {
    style = 'vibrant_dynamic';
  } else if (mood === 'calm') {
    style = 'soft_flowing';
  }
  
  return generateArtwork(style);
}

// Dynamic color selection
function getColorPalette(emotion) {
  const palettes = {
    joy: ['#FFD93D', '#FF6B6B', '#4ECDC4'],
    serenity: ['#96CEB4', '#FFEAA7', '#DDA0DD'],
    passion: ['#FF8E53', '#FFA726', '#FF7043']
  };
  
  return palettes[emotion] || palettes.serenity;
}`,
                exercises: [
                  {
                    title: 'Creative Decision Tree',
                    description: 'Build a decision tree that creates different artistic outputs.',
                    type: 'coding'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  };

  const currentContent = courseContent[course.id];
  const module = currentContent?.modules[currentModule];
  const lesson = module?.lessons[currentLesson];

  useEffect(() => {
    if (user && course) {
      loadLessonProgress();
    }
  }, [user, course, currentModule, currentLesson]);

  const loadLessonProgress = async () => {
    try {
      // For now, return empty progress since we don't have course progress API yet
      // This can be implemented later when course progress tracking is needed
      setLessonProgress({});
    } catch (error) {
      console.error('Error loading lesson progress:', error);
    }
  };

  const markLessonComplete = async () => {
    try {
      // For now, just show success message since we don't have course progress API yet
      // This can be implemented later when course progress tracking is needed
      showNotification('Lesson completed! Great job!', 'success');
      loadLessonProgress();
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const nextLesson = () => {
    if (currentLesson < module.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < currentContent.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    }
  };

  const prevLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentLesson(currentContent.modules[currentModule - 1].lessons.length - 1);
    }
  };

  if (!currentContent) {
    return (
      <div className="course-content">
        <div className="container">
          <p>Course content not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-content">
      <div className="course-sidebar">
        <div className="sidebar-header">
          <button className="back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h3>{course.title}</h3>
        </div>
        
        <div className="module-list">
          {currentContent.modules.map((mod, modIndex) => (
            <div key={mod.id} className={`module-item ${modIndex === currentModule ? 'active' : ''}`}>
              <div className="module-header" onClick={() => setCurrentModule(modIndex)}>
                <h4>{mod.title}</h4>
                <span className="lesson-count">{mod.lessons.length} lessons</span>
              </div>
              <div className="lesson-list">
                {mod.lessons.map((les, lesIndex) => (
                  <div 
                    key={les.id} 
                    className={`lesson-item ${modIndex === currentModule && lesIndex === currentLesson ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentModule(modIndex);
                      setCurrentLesson(lesIndex);
                    }}
                  >
                    <span className="lesson-title">{les.title}</span>
                    <span className="lesson-duration">{les.duration}</span>
                    {lessonProgress[les.id] && (
                      <i className="fas fa-check lesson-complete"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lesson-content">
        {lesson ? (
          <>
            <div className="lesson-header">
              <h2>{lesson.title}</h2>
              <div className="lesson-meta">
                <span className="duration">{lesson.duration}</span>
                <span className="type">{lesson.type}</span>
              </div>
            </div>

            <div className="lesson-body">
              {lesson.type === 'video' && (
                <div className="video-container">
                  <div className="video-placeholder">
                    <i className="fas fa-play"></i>
                    <p>Video: {lesson.content.description}</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      Play Video
                    </button>
                  </div>
                </div>
              )}

              <div className="lesson-description">
                <p>{lesson.content.description}</p>
              </div>

              <div className="key-points">
                <h4>Key Points:</h4>
                <ul>
                  {lesson.content.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              {lesson.content.codeExample && (
                <div className="code-example">
                  <h4>Code Example:</h4>
                  <pre><code>{lesson.content.codeExample}</code></pre>
                </div>
              )}

              {lesson.content.exercises && (
                <div className="exercises">
                  <h4>Exercises:</h4>
                  {lesson.content.exercises.map((exercise, index) => (
                    <div key={index} className="exercise">
                      <h5>{exercise.title}</h5>
                      <p>{exercise.description}</p>
                      {exercise.type === 'coding' && (
                        <div className="code-editor">
                          <textarea placeholder="Write your code here..."></textarea>
                          <button className="btn btn-secondary">Run Code</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {lesson.content.interactiveElements && (
                <div className="interactive-elements">
                  <h4>Interactive Elements:</h4>
                  {lesson.content.interactiveElements.map((element, index) => (
                    <div key={index} className="interactive-element">
                      <h5>{element.title}</h5>
                      <p>{element.description}</p>
                      <div className="interactive-placeholder">
                        <i className="fas fa-mouse-pointer"></i>
                        <p>Interactive {element.type} coming soon...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lesson-navigation">
              <button 
                className="btn btn-outline"
                onClick={prevLesson}
                disabled={currentModule === 0 && currentLesson === 0}
              >
                <i className="fas fa-chevron-left"></i> Previous
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={markLessonComplete}
              >
                Mark Complete
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={nextLesson}
                disabled={currentModule === currentContent.modules.length - 1 && 
                         currentLesson === module.lessons.length - 1}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="no-lesson">
            <p>Select a lesson to begin learning.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContent; 