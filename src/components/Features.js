import React from 'react';
import { useInView } from 'react-intersection-observer';

const Features = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const features = [
    {
      icon: 'fas fa-heart',
      title: 'Lifestyle Choice',
      description: 'Transform coding from a job into a way of life that brings joy, creativity, and fulfillment.'
    },
    {
      icon: 'fas fa-users',
      title: 'Global Community',
      description: 'Connect with like-minded developers worldwide who share your passion for creative coding.'
    },
    {
      icon: 'fas fa-music',
      title: 'Rhythm & Flow',
      description: 'Experience the natural rhythm of coding with music, beats, and creative expression.'
    },
    {
      icon: 'fas fa-infinity',
      title: 'Lifetime Access',
      description: 'Your vibe coding journey never ends - continuous learning and growth for life.'
    },
    {
      icon: 'fas fa-star',
      title: 'Future-Proof Skills',
      description: 'Master the skills that will define the future of programming and creative technology.'
    },
    {
      icon: 'fas fa-globe',
      title: 'Global Movement',
      description: 'Be part of a worldwide movement that\'s reshaping how we think about programming.'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">Why Embrace the Vibe Coding Lifestyle?</h2>
        <div className="features-grid" ref={ref}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
              }}
            >
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 