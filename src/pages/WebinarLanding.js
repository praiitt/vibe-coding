import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const WebinarLanding = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToAgenda = () => {
    console.log('See Agenda button clicked!');
    const agendaElement = document.getElementById('agenda');
    if (agendaElement) {
      console.log('Agenda element found, scrolling...');
      agendaElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('Agenda element not found!');
    }
  };

  return (
    <section className="webinar-landing">
      <div className="container">
        <div className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-fire"></i>
              <span>Live Session</span>
            </div>
            <h1 className="hero-title">Vibe Coding: Build an MVP Live in One Session</h1>
            <p className="hero-subtitle">21 September, 1:00 PM IST • Live Online • ₹99</p>
            <p className="hero-description">How vibe coding, AI-native tools, and creative flow will change how software is built—fast, collaborative, and joyful.</p>
            <div className="hero-buttons">
              <Link className="btn btn-primary" to="/webinar/register">
                <i className="fas fa-rocket"></i>
                Register for ₹99
              </Link>
              <button className="btn btn-secondary" onClick={scrollToAgenda}>
                <i className="fas fa-list"></i>
                See Agenda
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">2 Hours</span>
                <span className="stat-label">Live Session</span>
              </div>
              <div className="stat">
                <span className="stat-number">1 MVP</span>
                <span className="stat-label">Built Live</span>
              </div>
              <div className="stat">
                <span className="stat-number">Recording</span>
                <span className="stat-label">Included</span>
              </div>
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
          <div className="agenda-header">
            <h2 className="section-title">Agenda: Build a Real MVP, Live</h2>
            <p className="section-subtitle">2 hours of hands-on building with AI-native tools</p>
          </div>
          
          <div className="agenda-timeline">
            <div className="timeline-item">
              <div className="timeline-time">0:00 - 0:15</div>
              <div className="timeline-content">
                <div className="agenda-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="agenda-details">
                  <h3>Vision & Introduction</h3>
                  <p>Why Vibe Coding is the next paradigm of software creation</p>
                  <ul>
                    <li>Understanding the vibe coding philosophy</li>
                    <li>AI-native development principles</li>
                    <li>Speed vs quality trade-offs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-time">0:15 - 0:30</div>
              <div className="timeline-content">
                <div className="agenda-icon">
                  <i className="fas fa-book"></i>
                </div>
                <div className="agenda-details">
                  <h3>Playbook & Frameworks</h3>
                  <p>Rhythm, prompts, and decision frameworks for speed</p>
                  <ul>
                    <li>Prompt engineering for AI tools</li>
                    <li>Decision-making frameworks</li>
                    <li>Iteration loops and feedback cycles</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-time">0:30 - 0:45</div>
              <div className="timeline-content">
                <div className="agenda-icon">
                  <i className="fas fa-tools"></i>
                </div>
                <div className="agenda-details">
                  <h3>Platforms Deep-Dive</h3>
                  <p>Cursor, Lovable, and Emergent.sh walkthrough</p>
                  <ul>
                    <li>Cursor: AI-first IDE setup and workflows</li>
                    <li>Lovable: Full-stack app generation</li>
                    <li>Emergent.sh: Agentic development loops</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="timeline-item featured">
              <div className="timeline-time">0:45 - 1:30</div>
              <div className="timeline-content">
                <div className="agenda-icon">
                  <i className="fas fa-code"></i>
                </div>
                <div className="agenda-details">
                  <h3>Live Build Session</h3>
                  <p>Plan → scaffold → code → integrate → deploy</p>
                  <div className="build-flow">
                    <div className="flow-step">
                      <i className="fas fa-lightbulb"></i>
                      <span>Plan</span>
                    </div>
                    <i className="fas fa-arrow-right"></i>
                    <div className="flow-step">
                      <i className="fas fa-layer-group"></i>
                      <span>Scaffold</span>
                    </div>
                    <i className="fas fa-arrow-right"></i>
                    <div className="flow-step">
                      <i className="fas fa-code"></i>
                      <span>Code</span>
                    </div>
                    <i className="fas fa-arrow-right"></i>
                    <div className="flow-step">
                      <i className="fas fa-link"></i>
                      <span>Integrate</span>
                    </div>
                    <i className="fas fa-arrow-right"></i>
                    <div className="flow-step">
                      <i className="fas fa-rocket"></i>
                      <span>Deploy</span>
                    </div>
                  </div>
                  <div className="build-highlights">
                    <span className="highlight">🎯 Real MVP</span>
                    <span className="highlight">⚡ Live Coding</span>
                    <span className="highlight">🤖 AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-time">1:30 - 1:45</div>
              <div className="timeline-content">
                <div className="agenda-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="agenda-details">
                  <h3>Launch & Next Steps</h3>
                  <p>Handoff, metrics, and iteration planning</p>
                  <ul>
                    <li>Deployment and monitoring setup</li>
                    <li>Key metrics to track</li>
                    <li>Iteration and improvement loops</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-time">1:45 - 2:00</div>
              <div className="timeline-content">
                <div className="agenda-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="agenda-details">
                  <h3>Q&A + Community</h3>
                  <p>Onboarding and networking</p>
                  <ul>
                    <li>Answer your burning questions</li>
                    <li>Community access and resources</li>
                    <li>Next steps for your projects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="deliverable-card">
            <div className="deliverable-icon">
              <i className="fas fa-rocket"></i>
            </div>
            <div className="deliverable-content">
              <h3>What You'll Get</h3>
              <div className="deliverable-list">
                <div className="deliverable-item">
                  <i className="fas fa-check"></i>
                  <span>A working MVP by session end</span>
                </div>
                <div className="deliverable-item">
                  <i className="fas fa-check"></i>
                  <span>Complete source code repository</span>
                </div>
                <div className="deliverable-item">
                  <i className="fas fa-check"></i>
                  <span>Live URL (where possible)</span>
                </div>
                <div className="deliverable-item">
                  <i className="fas fa-check"></i>
                  <span>Session recording for review</span>
                </div>
                <div className="deliverable-item">
                  <i className="fas fa-check"></i>
                  <span>Community access and support</span>
                </div>
              </div>
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
