import React from 'react';
import { FaMapMarkerAlt, FaRegClock, FaTicketAlt, FaTimes } from 'react-icons/fa';
import './EventsList.css';

const RegisteredEventsList = ({ events, onCancelRegistration }) => {
  const handleCancelRegistration = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      try {
        await fetch(`/api/events/${eventId}/registration`, { method: 'DELETE' });
        onCancelRegistration(); 
      } catch (error) {
        console.error('Error canceling registration:', error);
      }
    }
  };

  const handleDownloadTicket = (event) => {
    console.log('Downloading ticket for event:', event._id);
    alert
    (
      `Ticket for ${event.title} downloaded successfully!`
    );
  };

  return (
    <div className="events-list">
      {events.length === 0 ? (
        <div className="no-events">
          <h3>No Registered Events</h3>
          <p>Browse and register for events to see them here!</p>
        </div>
      ) : (
        events.map(event => (
          <div key={event._id} className="event-card registered">
            <div className="event-image">
              <img src={event.image} alt={event.title} />
            </div>

            <div className="event-details">
              <h3>{event.title}</h3>
              <div className="event-meta">
                <span className="event-date">
                  <FaRegClock />
                  {new Date(event.startDate).toLocaleDateString()}
                </span>
                <span className="event-location">
                  <FaMapMarkerAlt />
                  {event.venue}
                </span>
              </div>
              <div className="registration-info">
                <span className="ticket-number">
                  <FaTicketAlt />
                  Ticket #: {event._id}
                </span>
              </div>
            </div>

            <div className="event-actions">
              <button 
                className="btn-download"
                onClick={() => handleDownloadTicket(event)}
                title="Download Ticket"
              >
                Get Ticket 
              </button>
              {new Date(event.startDate) > new Date() && (
                <button 
                  className="btn-cancel"
                  onClick={() => handleCancelRegistration(event._id)}
                  title="Cancel Registration"
                >
                  <FaTimes />
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RegisteredEventsList;