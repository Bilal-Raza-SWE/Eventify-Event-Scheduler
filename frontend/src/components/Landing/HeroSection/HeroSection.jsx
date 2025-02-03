import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const handleImageLoad = (e) => {
    e.target.classList.add('loaded');
  };
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Discover Amazing Events Near You</h1>
        <p>Join thousands of people who use EventHub to discover, create, and manage memorable events.</p>
        
        <div className="featured-event">
          <div className="event-card">
          <img onLoad={handleImageLoad} src="https://acropolium.com/img/articles/event-management-software-solutions/img04.jpg" alt="Featured Event" />
            <div className="event-info">
              <span className="event-date">Upcoming: July 15, 2024</span>
              <h3>Tech Conference 2024</h3>
              <p>Join industry leaders for the biggest tech conference of the year</p>
              <Link to="/events/tech-conf-2024" className="btn-learn-more">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        <div className="hero-search">
          <input 
            type="text" 
            placeholder="Search for events..."
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;