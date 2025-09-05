import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const WebinarLanding = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="webinar-landing">
      <div className="container">
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Vibe Coding: Build an MVP Live in One Session</h1>
            <p className="hero-subtitle">21 September, 1:00 PM IST • Live Online • ₹99</p>
            <p className="hero-subtitle">How vibe coding, AI-native tools, and creative flow will change how software is built—fast, collaborative, and joyful.</p>
            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/webinar/register">Register for ₹99</Link>
              <a className="btn btn-secondary" href="#agenda">See Agenda</a>
            </div>
          </div>
        </div>

        <div id="benefits" className="benefits">
          <h2 className="section-title">Why Vibe Coding Will Change the World</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-infinity" /></div>
              <h3>AI-Native Development</h3>
              <p>Ship faster by pairing your vision with AI copilots that understand context, codebases, and intent.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-bolt" /></div>
              <h3>From Idea → MVP</h3>
              <p>Turn concepts into working MVPs in hours, not months, by coding in rhythm and streamlining decisions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-users" /></div>
              <h3>Creator Economy Ready</h3>
              <p>Indie founders and teams can build, iterate, and launch at the speed of imagination.</p>
            </div>
          </div>
        </div>

        <div className="platforms">
          <h2 className="section-title">Vibe Coding Platforms We’ll Use</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-terminal" /></div>
              <h3>Cursor</h3>
              <p>AI-first IDE to code with copilots, edit entire repos, and accelerate implementation with context-aware changes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-heart" /></div>
              <h3>Lovable</h3>
              <p>Generate full-stack apps from prompts, then refine with powerful UI and data tools—perfect for MVPs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-rocket" /></div>
              <h3>Emergent.sh</h3>
              <p>Agentic workflows for building and iterating features end‑to‑end—design, code, deploy in loops.</p>
            </div>
          </div>
        </div>

        <div id="agenda" className="agenda">
          <h2 className="section-title">Agenda: Build a Real MVP, Live</h2>
          <div className="agenda-grid">
            <div className="agenda-item">
              <div className="agenda-icon">
                <i className="fas fa-eye"></i>
              </div>
              <div className="agenda-content">
                <h3>Vision</h3>
                <p>Why Vibe Coding is the next paradigm of software creation</p>
              </div>
            </div>
            
            <div className="agenda-item">
              <div className="agenda-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="agenda-content">
                <h3>Playbook</h3>
                <p>Rhythm, prompts, and decision frameworks for speed</p>
              </div>
            </div>
            
            <div className="agenda-item">
              <div className="agenda-icon">
                <i className="fas fa-tools"></i>
              </div>
              <div className="agenda-content">
                <h3>Platforms Deep-Dive</h3>
                <p>Cursor, Lovable, and Emergent.sh</p>
              </div>
            </div>
            
            <div className="agenda-item featured">
              <div className="agenda-icon">
                <i className="fas fa-code"></i>
              </div>
              <div className="agenda-content">
                <h3>Live Build</h3>
                <p>Plan → scaffold → code → integrate → deploy</p>
                <div className="build-flow">
                  <span className="flow-step">Plan</span>
                  <i className="fas fa-arrow-right"></i>
                  <span className="flow-step">Scaffold</span>
                  <i className="fas fa-arrow-right"></i>
                  <span className="flow-step">Code</span>
                  <i className="fas fa-arrow-right"></i>
                  <span className="flow-step">Integrate</span>
                  <i className="fas fa-arrow-right"></i>
                  <span className="flow-step">Deploy</span>
                </div>
              </div>
            </div>
            
            <div className="agenda-item">
              <div className="agenda-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="agenda-content">
                <h3>Launch Checklist</h3>
                <p>Handoff, metrics, iteration loop</p>
              </div>
            </div>
            
            <div className="agenda-item">
              <div className="agenda-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="agenda-content">
                <h3>Q&A + Community</h3>
                <p>Onboarding and networking</p>
              </div>
            </div>
          </div>
          
          <div className="deliverable-card">
            <div className="deliverable-icon">
              <i className="fas fa-rocket"></i>
            </div>
            <div className="deliverable-content">
              <h3>Deliverable</h3>
              <p>A working MVP by session end (repo + live URL where possible)</p>
            </div>
          </div>
        </div>

        <div className="speaker">
          <h2 className="section-title">Your Host</h2>
          <div className="speaker-card feature-card">
            <div className="feature-icon"><i className="fas fa-user-astronaut" /></div>
            <h3>Prakash — Creator of Vibe Coding</h3>
            <p>Engineer, creative technologist, and community builder. Helping devs code with rhythm, flow, and purpose.</p>
          </div>
        </div>

        <div className="cta">
          <h2 className="section-title">Build an MVP With Us — Live</h2>
          <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>Limited seats • Recording included • Community access</p>
          <Link className="btn btn-primary" to="/webinar/register">Register Now for ₹99</Link>
        </div>
      </div>
    </section>
  );
};

export default WebinarLanding;
