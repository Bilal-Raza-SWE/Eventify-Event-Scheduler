import React, { useState, useEffect } from 'react';
import { 
  FaCalendarCheck, 
  FaCalendarTimes, 
  FaList ,
  FaSpinner
} from 'react-icons/fa';
import { eventService } from '../../../services/api';
import './UserEvents.css';

const UserEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState({
    upcoming: [],
    created: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [upcomingEvents, createdEvents, pastEvents] = await Promise.all([
        eventService.getUserUpcomingEvents(),
        eventService.getUserCreatedEvents(),
        eventService.getUserPastEvents()
      ]);

      setEvents({
        upcoming: upcomingEvents,
        created: createdEvents,
        past: pastEvents
      });
    } catch (error) {
      console.error('Failed to fetch events', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }; 

  const renderEventList = (eventsList) => {
    if (loading) {
      return (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading events...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchEvents} className="retry-button">
            Try Again
          </button>
        </div>
      );
    }

    if (!eventsList.length) {
      return (
        <div className="no-events">
          <p>No events to display</p>
        </div>
      );
    }

    return eventsList.map(event => (
      <div key={event._id} className="event-card">
        <div className="event-image">
          {event.image ? (
            <img src={event.image} alt={event.title} />
          ) : (
            <div className="placeholder-image">
              <FaCalendarCheck />
            </div>
          )}
        </div>
        
        <div className="event-details">
          <h3>{event.title}</h3>
          <div className="event-meta">
            <span className="event-date">
              <FaCalendarCheck />
              {new Date(event.startDate).toLocaleDateString()}
            </span>
            <span className="event-category">
              <FaList />
              {event.category}
            </span>
          </div>
          <p className="event-description">{event.description}</p>
          <div className="event-stats">
            <span>{event.registeredAttendees}/{event.capacity} registered</span>
          </div>
        </div>

        <div className="event-actions">
          <button 
            className="view-details-btn"
            onClick={() => window.location.href = `/events/${event._id}`}
          >
            View Details
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h1>My Events</h1>
        <div className="events-tabs">
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={`tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            Created Events
          </button>
          <button 
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>
      </div>

      <div className="events-content">
        {activeTab === 'upcoming' && (
          <div className="upcoming-events">
            <h2>Upcoming Events</h2>
            <div className="events-grid">
              {renderEventList(events.upcoming)}
            </div>
          </div>
        )}

        {activeTab === 'created' && (
          <div className="created-events">
            <h2>Events You've Created</h2>
            <div className="events-grid">
              {renderEventList(events.created)}
            </div>
          </div>
        )}

        {activeTab === 'past' && (
          <div className="past-events">
            <h2>Past Events</h2>
            <div className="events-grid">
              {renderEventList(events.past)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents;