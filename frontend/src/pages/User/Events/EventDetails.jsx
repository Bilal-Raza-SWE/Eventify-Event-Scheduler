import React, { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaTicketAlt,
  FaComment
} from 'react-icons/fa';
import { eventService } from '../../../services/api';
import './EventDetails.css';

const EventDetails = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(eventId);
        setEvent(eventData);

        const registrations = await eventService.getUserRegisteredEvents();
        const registered = registrations.some(reg => reg._id === eventId);
        setIsRegistered(registered);

        const eventComments = await eventService.getEventComments(eventId);
        setComments(eventComments);

        setError(null);
      } catch (err) {
        setError('Failed to load event details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);


  const handleRegister = async () => {
    try {
      await eventService.registerForEvent(eventId);
      setIsRegistered(true);
      alert('Successfully registered for the event!');
    } catch (err) {
      setError(err.message);
    }
  };


  const handleAddComment = async () => {
    try {
      const newCommentData = await eventService.addComment(eventId, newComment);
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    }
  };

  if (!event) return <div>Loading...</div>;
  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="event-details-container">
      <div className="event-header">
        <img src={event.image} alt={event.title} className="event-hero-image" />
        <div className="event-header-overlay">
          <h1>{event.title}</h1>
          <div className="event-header-meta">
            <span><FaCalendar /> {new Date(event.startDate).toLocaleDateString()}</span>
            <span><FaMapMarkerAlt /> {event.venue}</span>
          </div>
        </div>
      </div>

      <div className="event-details-grid">
        <div className="event-main-details">
          <h2>Event Description</h2>
          <p>{event.description}</p>

          <div className="event-additional-info">
            <div className="info-block">
              <FaUsers />
              <h3>Attendees</h3>
              <p>{event.registeredAttendees}/{event.capacity} Registered</p>
            </div>

            <div className="info-block">
              <FaTicketAlt />
              <h3>Ticket Price</h3>
              <p>{event.price === 0 ? 'Free' : `$${event.price}`}</p>
            </div>
          </div>

          {!isRegistered ? (
            <button
              className="btn-register-event"
              onClick={handleRegister}
              disabled={event.registeredAttendees >= event.capacity}
            >
              {event.registeredAttendees >= event.capacity
                ? 'Event Full'
                : 'Register for Event'}
            </button>
          ) : (
            <div className="registered-badge">You're Registered!</div>
          )}
        </div>


        <div className="event-comments-section">
          <h2>Event Discussion</h2>

          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="comment">
                  <img
                    src={comment.user.avatar || '/default-avatar.png'}
                    alt={comment.user.name}
                  />
                  <div className="comment-content">
                    <h4>{comment.user.name}</h4>
                    <p>{comment.text}</p>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="add-comment">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={500}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <FaComment /> Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;