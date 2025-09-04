import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const WebinarSuccess = () => {
  const params = new URLSearchParams(useLocation().search);
  const ref = params.get('ref');

  const addToCalendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vibe%20Coding%20Webinar&dates=20240922T133000Z/20240922T150000Z&details=Join%20the%20webinar%20-%20we%27ll%20email%20you%20the%20link%20before%20the%20event.&location=Online`;

  return (
    <section className="webinar-success">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 className="section-title">Registration Successful! 🎉</h1>
        <p className="success-message">Your details have been saved to our database and registration is confirmed for the Vibe Coding Webinar on 22 September, 7:00 PM IST.</p>
        {ref && <p className="reference-info">Reference ID: {ref}</p>}

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📧 You'll receive a confirmation email shortly</li>
            <li>📅 Add the event to your calendar</li>
            <li>📱 We'll send you the webinar link 1 hour before the event</li>
            <li>💬 Join our community for updates and discussions</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <a className="btn btn-primary" href={addToCalendarLink} target="_blank" rel="noreferrer">
            <i className="fas fa-calendar-plus" style={{ marginRight: '8px' }}></i>
            Add to Google Calendar
          </a>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link className="btn btn-outline" to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  );
};

export default WebinarSuccess;
