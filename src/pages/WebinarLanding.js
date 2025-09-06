import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const WebinarLanding = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    // Set the end date (5 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    endDate.setHours(23, 59, 59, 999); // End of day

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
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
            <h1 className="hero-title">Vibe Coding: Build an MVP Live</h1>
            <div className="pricing-info">
              <div className="price-container">
                <span className="original-price">₹999</span>
                <span className="discounted-price">₹99</span>
                <span className="discount-badge">90% OFF</span>
              </div>
              <p className="hero-subtitle">21 September, 1:00 PM IST • Live Online</p>
            </div>
                                <div className="hero-content-row">
                      <div className="hero-left">
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
                      </div>
                      
                      <div className="countdown-timer">
                        <div className="timer-header">
                          <i className="fas fa-clock"></i>
                          <span>Limited Time Offer</span>
                        </div>
                        <div className="timer-subtitle">Registration Closes In:</div>
                        <div className="timer-display">
                          <div className="timer-unit">
                            <span className="timer-number">{timeLeft.days}</span>
                            <span className="timer-label">Days</span>
                          </div>
                          <div className="timer-separator">:</div>
                          <div className="timer-unit">
                            <span className="timer-number">{timeLeft.hours}</span>
                            <span className="timer-label">Hours</span>
                          </div>
                          <div className="timer-separator">:</div>
                          <div className="timer-unit">
                            <span className="timer-number">{timeLeft.minutes}</span>
                            <span className="timer-label">Minutes</span>
                          </div>
                          <div className="timer-separator">:</div>
                          <div className="timer-unit">
                            <span className="timer-number">{timeLeft.seconds}</span>
                            <span className="timer-label">Seconds</span>
                          </div>
                        </div>
                      </div>
                    </div>
            <div className="hero-stats">
              <div className="stat-item">
                <i className="fas fa-clock"></i>
                <span>2 Hours Live</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-code"></i>
                <span>1 MVP Built</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-video"></i>
                <span>Recording Included</span>
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
          <h2 className="section-title">Vibe Coding Platforms — Pick Your Flow</h2>
          <p className="section-subtitle">Whether you write code daily or you’re non‑technical, we’ve got a powerful path for you.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-terminal" /></div>
              <h3>For Coders: Cursor</h3>
              <p>AI‑first IDE for developers. Pair with copilots, refactor whole repos, and ship faster with context‑aware edits and agentic commands. Perfect if you want to code live.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-rocket" /></div>
              <h3>For Non‑Coders: Emergent.sh</h3>
              <p>No-code/low‑code agentic workflows. Describe what you want; agents plan, build, and iterate end‑to‑end—design → code → deploy—so you can focus on your idea, not syntax.</p>
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
          
          <div className="deliverables-section">
            <h3 className="deliverables-title">
              <i className="fas fa-rocket"></i>
              What You'll Get
            </h3>
            <div className="deliverables-grid">
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

        <div className="speaker">
          <h2 className="section-title">Your Host</h2>
          <div className="speaker-card feature-card">
            <div className="feature-icon"><i className="fas fa-user-astronaut" /></div>
            <h3>Prakash — Creator of Vibe Coding</h3>
            <p>Engineer, creative technologist, and community builder. Helping devs code with rhythm, flow, and purpose.</p>
          </div>
        </div>

        <div className="cta">
          <h2 className="cta-title">Build an MVP With Us — Live</h2>
          <div className="cta-pricing">
            <div className="cta-price-container">
              <span className="cta-original-price">₹999</span>
              <span className="cta-discounted-price">₹99</span>
              <span className="cta-discount-badge">90% OFF</span>
            </div>
            <p className="cta-subtitle">Limited seats • Recording included • Community access</p>
          </div>
          <Link className="btn btn-primary cta-button" to="/webinar/register">Register Now for ₹99</Link>
        </div>
      </div>
    </section>
  );
};

export default WebinarLanding;
