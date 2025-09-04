import React from 'react';
import { useInView } from 'react-intersection-observer';

const Curriculum = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const modules = [
    {
      number: '01',
      title: 'Mindset Transformation',
      content: [
        'Shift from job to lifestyle mentality',
        'Embrace creativity in every line of code',
        'Develop your unique coding rhythm',
        'Build sustainable coding habits'
      ]
    },
    {
      number: '02',
      title: 'Creative Expression',
      content: [
        'Code as an art form',
        'Visual storytelling through programming',
        'Emotional connection with your projects',
        'Personal branding through code'
      ]
    },
    {
      number: '03',
      title: 'Rhythm & Flow State',
      content: [
        'Music-driven development sessions',
        'Beat-synchronized coding techniques',
        'Flow state optimization',
        'Energy management for coders'
      ]
    },
    {
      number: '04',
      title: 'Future Lifestyle',
      content: [
        'Remote work lifestyle integration',
        'Digital nomad coding practices',
        'Work-life harmony through code',
        'Building your dream lifestyle'
      ]
    }
  ];

  return (
    <section id="curriculum" className="curriculum">
      <div className="container">
        <h2 className="section-title">Your Vibe Coding Journey</h2>
        <div className="curriculum-grid" ref={ref}>
          {modules.map((module, index) => (
            <div 
              key={index}
              className="module"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
              }}
            >
              <div className="module-header">
                <span className="module-number">{module.number}</span>
                <h3>{module.title}</h3>
              </div>
              <ul className="module-content">
                {module.content.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Curriculum; 