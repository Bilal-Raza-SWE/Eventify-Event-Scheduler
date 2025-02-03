import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaAward, FaGlobe } from 'react-icons/fa';
import './Story.css';

const Story = () => {
  const milestones = [
    {
      year: 2021,
      title: "The Beginning",
      description: "Started with a vision to revolutionize event management",
      icon: <FaRocket />,
      metric: "Launch Year"
    },
    {
      year: 2022,
      title: "Community Growth",
      description: "Reached 100,000 active users across 50 countries",
      icon: <FaUsers />,
      metric: "100K+ Users"
    },
    {
      year: 2023,
      title: "Award-Winning Platform",
      description: "Recognized as the Best Event Management Platform",
      icon: <FaAward />,
      metric: "15+ Awards"
    },
    {
      year: 2024,
      title: "Global Expansion",
      description: "Now serving events in over 100 countries worldwide",
      icon: <FaGlobe />,
      metric: "Global Reach"
    }
  ];

  return (
    <section id="story" className="story">
      <div className="story-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Journey
        </motion.h2>

        <div className="timeline">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="timeline-icon">
                {milestone.icon}
              </div>
              
              <div className="timeline-content">
                <div className="year">{milestone.year}</div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <div className="metric">{milestone.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="story-stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="stat">
            <h3>100K+</h3>
            <p>Events Hosted</p>
          </div>
          <div className="stat">
            <h3>1M+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat">
            <h3>150+</h3>
            <p>Countries</p>
          </div>
          <div className="stat">
            <h3>98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Story;