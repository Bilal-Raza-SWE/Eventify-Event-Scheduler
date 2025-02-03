import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './FeaturedEvents.css';

const FeaturedEvents = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Tech Summit 2024',
      date: 'July 15-16, 2024',
      location: 'San Francisco, CA',
      image: 'https://acropolium.com/img/articles/event-management-software-solutions/img07.jpg',
      category: 'tech',
      price: '$299',
      attendees: 1200,
      spots: 'Limited spots available'
    },  
    {
      id: 2,
      title: 'Tech Summit 2024',
      date: 'July 15-16, 2024',
      location: 'San Francisco, CA',
      image: 'https://acropolium.com/img/articles/event-management-software-solutions/img07.jpg',
      category: 'tech',
      price: '$299',
      attendees: 1200,
      spots: 'Limited spots available'
    },    {
      id: 3,
      title: 'Tech Summit 2024',
      date: 'July 15-16, 2024',
      location: 'San Francisco, CA',
      image: 'https://acropolium.com/img/articles/event-management-software-solutions/img07.jpg',
      category: 'tech',
      price: '$299',
      attendees: 1200,
      spots: 'Limited spots available'
    },
  ];

  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(event => event.category === activeCategory);


    const handleImageLoad = (e) => {
      e.target.classList.add('loaded');
    };
    
  return (
    <section id="events" className="featured-events">
      <div className="featured-events-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Events
        </motion.h2>

        <motion.div 
          className="events-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="event-image">
              <img onLoad={handleImageLoad} src={event.image} alt={event.title}  />

                <span className="event-category">{event.category}</span>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <div className="event-info">
                  <span className="event-date">{event.date}</span>
                  <span className="event-location">{event.location}</span>
                </div>
                <div className="event-meta">
                  <span className="event-price">{event.price}</span>
                  <span className="event-spots">{event.spots}</span>
                </div>
                <div className="event-attendees">
                  <div className="attendee-avatars">
                  </div>
                  <span>{event.attendees}+ attending</span>
                </div>
                <Link to={`/events/${event.id}`} className="btn-view-event">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;