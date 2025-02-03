import React from 'react';
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const startDateTime = formatDateTime(event.startDate);
  const endDateTime = formatDateTime(event.endDate);

  return (
    <div className="modal-overlay">
      <div className="event-details-modal">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="event-header">
          <img src={event.image} alt={event.title} />
          <div className="event-title-section">
            <h2>{event.title}</h2>
            <span className={`status-badge ${event.status}`}>
              {event.status}
            </span>
          </div>
        </div>

        <div className="event-details-grid">
          <div className="detail-card">
            <FaCalendarAlt className="detail-icon" />
            <div className="detail-content">
              <h4>Date & Time</h4>
              <p>Starts: {startDateTime.date} at {startDateTime.time}</p>
              <p>Ends: {endDateTime.date} at {endDateTime.time}</p>
            </div>
          </div>

          <div className="detail-card">
            <FaMapMarkerAlt className="detail-icon" />
            <div className="detail-content">
              <h4>Location</h4>
              <p>{event.venue}</p>
              <p>{event.address}</p>
            </div>
          </div>

          <div className="detail-card">
            <FaUsers className="detail-icon" />
            <div className="detail-content">
              <h4>Capacity & Registration</h4>
              <p>{event.registeredAttendees} / {event.capacity} Registered</p>
              <div className="capacity-bar">
                <div 
                  className="capacity-fill"
                  style={{ 
                    width: `${(event.registeredAttendees / event.capacity) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <FaClock className="detail-icon" />
            <div className="detail-content">
              <h4>Registration Deadline</h4>
              <p>{formatDateTime(event.registrationDeadline).date}</p>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h3>Event Description</h3>
          <p>{event.description}</p>
        </div>

        <div className="organizer-details">
          <h3>Organizer Information</h3>
          <div className="organizer-card">
            <img src={event.organizerImage} alt={event.organizer} />
            <div>
              <h4>{event.organizer}</h4>
              <p>{event.organizerEmail}</p>
              <p>{event.organizerPhone}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {event.status === 'pending' && (
            <div className="approval-actions">
              <button className="btn-approve">Approve Event</button>
              <button className="btn-reject">Reject Event</button>
            </div>
          )}
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;