import React from 'react';
import { FaCalendar, FaUsers, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import './About.css';

const About = () => {
  const features = [
    {
      icon: <FaCalendar />,
      title: 'Easy Event Creation',
      description: 'Create and customize your events in minutes with our intuitive event management tools.'
    },
    {
      icon: <FaUsers />,
      title: 'Community Driven',
      description: 'Connect with like-minded individuals and grow your network through meaningful events.'
    },
    {
      icon: <FaChartLine />,
      title: 'Detailed Analytics',
      description: 'Track your event performance with comprehensive analytics and attendee insights.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with enterprise-grade security measures.'
    }
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-header">
          <h2>Why Choose EventHub?</h2>
          <p>We're more than just an event platform - we're your partner in creating memorable experiences.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="about-story">
          <h3>Our Story</h3>
          <p>
            Started in 2024, EventHub has grown from a simple event listing platform to a comprehensive 
            event management solution trusted by thousands of organizers worldwide. Our mission is to 
            make event planning and attendance seamless and enjoyable for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;