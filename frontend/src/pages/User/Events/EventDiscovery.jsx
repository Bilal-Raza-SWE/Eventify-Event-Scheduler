import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendar, FaMapMarkerAlt, FaBookmark, FaSpinner } from 'react-icons/fa';
import { eventService } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './EventDiscovery.css';

const EventDiscovery = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    location: '',
    search: ''
  });

  useEffect(() => {
    fetchEvents();
    if (currentUser) {
      fetchUserBookmarks();
    }
  }, [filters, currentUser]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await eventService.getAllEvents(filters);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookmarks = async () => {
    try {
      const bookmarks = await eventService.getUserBookmarks();
      const bookmarkedIds = new Set(bookmarks.map(bookmark => bookmark.event._id));
      setBookmarkedEvents(bookmarkedIds);
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    }
  };

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      await eventService.registerForEvent(eventId);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId 
            ? { ...event, registeredAttendees: event.registeredAttendees + 1 }
            : event
        )
      );
      alert('Successfully registered for the event!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBookmark = async (eventId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      if (bookmarkedEvents.has(eventId)) {
        await eventService.removeBookmark(eventId);
        setBookmarkedEvents(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await eventService.addBookmark(eventId);
        setBookmarkedEvents(prev => new Set([...prev, eventId]));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const renderEventCards = () => {
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

    if (events.length === 0) {
      return (
        <div className="no-events-found">
          <p>No events match your search criteria.</p>
        </div>
      );
    }

    return events.map(event => (
      <div key={event._id} className="event-card">
        <div className="event-image">
          <img src={event.image} alt={event.title} />
          <button 
            className={`bookmark-btn ${bookmarkedEvents.has(event._id) ? 'active' : ''}`}
            onClick={() => handleBookmark(event._id)}
            title={bookmarkedEvents.has(event._id) ? 'Remove Bookmark' : 'Bookmark Event'}
          >
            <FaBookmark />
          </button>
        </div>

        <div className="event-details">
          <h3>{event.title}</h3>
          <div className="event-meta">
            <span className="event-date">
              <FaCalendar />
              {new Date(event.startDate).toLocaleDateString()}
            </span>
            <span className="event-location">
              <FaMapMarkerAlt />
              {event.venue}
            </span>
          </div>
          <p className="event-description">{event.description.slice(0, 150)}...</p>
          <div className="event-capacity">
            <div className="capacity-bar">
              <div 
                className="capacity-fill"
                style={{ 
                  width: `${(event.registeredAttendees / event.capacity) * 100}%` 
                }}
              ></div>
            </div>
            <span className="capacity-text">
              {event.registeredAttendees}/{event.capacity} spots filled
            </span>
          </div>
          <div className="event-actions">
            <button 
              className="btn-register"
              onClick={() => handleRegister(event._id)}
              disabled={event.registeredAttendees >= event.capacity}
            >
              {event.registeredAttendees >= event.capacity ? 'Event Full' : 'Register'}
            </button>
            <button 
              className="btn-details"
              onClick={() => navigate(`/events/${event._id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="event-discovery-container">
      <div className="discovery-header">
        <h1>Discover Events</h1>
        <div className="search-filter-container">
          <div className="search-input">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                search: e.target.value
              }))}
            />
          </div>
          
          <div className="filter-dropdowns">
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                category: e.target.value
              }))}
            >
              <option value="">All Categories</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
            </select>

            <input 
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                date: e.target.value
              }))}
            />

            <input 
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                location: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      <div className="events-grid">
        {renderEventCards()}
      </div>
    </div>
  );
};

export default EventDiscovery;