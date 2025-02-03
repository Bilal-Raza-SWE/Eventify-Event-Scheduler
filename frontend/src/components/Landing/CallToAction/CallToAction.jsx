import React from 'react';
import { Link } from 'react-router-dom';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2>Ready to Create Your Own Event?</h2>
          <p>Join thousands of event organizers who trust our platform to create and manage successful events. Get started today and turn your vision into reality.</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary">
              Create Your Event
            </Link>
            <Link to="/browse-events" className="btn-secondary">
              Explore Events
            </Link>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-number">30-day</span>
              <span className="trust-text">Free Trial</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">24/7</span>
              <span className="trust-text">Support</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">100%</span>
              <span className="trust-text">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;