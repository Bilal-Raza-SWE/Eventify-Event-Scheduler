import React from 'react';
import { FaCalendarAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';
import './Statistics.css';

const Statistics = () => {
  const stats = [
    {
      icon: <FaCalendarAlt />,
      count: '1,000+',
      label: 'Events Hosted',
      description: 'Successful events organized through our platform'
    },
    {
      icon: <FaUsers />,
      count: '50,000+',
      label: 'Active Users',
      description: 'Growing community of event enthusiasts'
    },
    {
      icon: <FaCheckCircle />,
      count: '95%',
      label: 'Satisfaction Rate',
      description: 'Positive feedback from our users'
    }
  ];

  return (
    <section className="statistics">
      <div className="statistics-container">
        <h2>Our Impact in Numbers</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-count">{stat.count}</h3>
              <h4 className="stat-label">{stat.label}</h4>
              <p className="stat-description">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;