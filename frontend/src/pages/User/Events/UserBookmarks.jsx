import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaTrash, FaSpinner, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { eventService } from '../../../services/api';
import './UserBookmarks.css';

const UserBookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const fetchedBookmarks = await eventService.getUserBookmarks();
      setBookmarks(fetchedBookmarks);
      console.log(fetchedBookmarks);
      setError(null);
    } 
    catch (err) {
      setError('Failed to fetch bookmarks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (eventId) => {
    try {
      setProcessingId(eventId);
      await eventService.removeBookmark(eventId);
      setBookmarks(prevBookmarks => 
        prevBookmarks.filter(bookmark => bookmark.event._id !== eventId)
      );
    } catch (err) {
      setError('Failed to remove bookmark. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRegisterFromBookmark = async (eventId) => {
    try {
      setProcessingId(eventId);
      await eventService.registerForEvent(eventId);
      await handleRemoveBookmark(eventId);
      navigate('/user/tickets');
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading your bookmarks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchBookmarks} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-bookmarks-container">
      <div className="bookmarks-header">
        <h1>
          <FaBookmark /> My Bookmarks
        </h1>
        <p>Events you've saved for later</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="no-bookmarks">
          <FaBookmark className="empty-icon" />
          <h2>No Bookmarked Events</h2>
          <p>Browse events and bookmark the ones you're interested in!</p>
          <button 
            className="discover-events-btn"
            onClick={() => navigate('/events/discover')}
          >
            Discover Events
          </button>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map(bookmark => (
            <div key={bookmark.event._id} className="bookmark-card">
              <div className="bookmark-image">
                <img src={bookmark.event.image} alt={bookmark.event.title} />
                <button 
                  className="remove-bookmark"
                  onClick={() => handleRemoveBookmark(bookmark.event._id)}
                  disabled={processingId === bookmark.event._id}
                >
                  {processingId === bookmark.event._id ? (
                    <FaSpinner className="spinner" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>

              <div className="bookmark-details">
                <h3>{bookmark.event.title}</h3>
                <div className="event-meta">
                  <span>
                    <FaCalendar />
                    {new Date(bookmark.event.startDate).toLocaleDateString()}
                  </span>
                  <span>
                    <FaMapMarkerAlt />
                    {bookmark.event.venue}
                  </span>
                </div>
                <p className="event-description">
                  {bookmark.event.description.slice(0, 150)}...
                </p>
                <div className="capacity-info">
                  <span>{bookmark.event.registeredAttendees}/{bookmark.event.capacity} spots filled</span>
                </div>
                <div className="bookmark-actions">
                  <button 
                    className="btn-view-details"
                    onClick={() => navigate(`/events/${bookmark.event._id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn-register"
                    onClick={() => handleRegisterFromBookmark(bookmark.event._id)}
                    disabled={
                      processingId === bookmark.event._id || 
                      bookmark.event.registeredAttendees >= bookmark.event.capacity
                    }
                  >
                    {bookmark.event.registeredAttendees >= bookmark.event.capacity 
                      ? 'Event Full' 
                      : processingId === bookmark.event._id 
                        ? 'Registering...' 
                        : 'Register Now'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookmarks;