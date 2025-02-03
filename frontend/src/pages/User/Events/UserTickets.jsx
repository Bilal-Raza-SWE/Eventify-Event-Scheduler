import React, { useState, useEffect } from 'react';
import { FaTicketAlt, QrCod, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';
import { userEventService } from '../../../services/api';

import './UserTickets.css';

const UserTickets = ({ events = []}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  
  useEffect(() => {

    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/user/tickets');
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
    };

    fetchTickets();
  }, []);

  const handleDownloadTicket = (event) => {
    console.log('Downloading ticket for event:', event._id);
    alert
    (
      `Ticket for ${event.title} downloaded successfully!`
    );
  };

  return (
    <div className="user-tickets-container">
      <h1>
        <FaTicketAlt /> My Tickets
      </h1>

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
                    
                  </div>
                </div>
              ))
            )}
          </div>

      {tickets.length === 0 ? (
        <div className="no-tickets">
              
          <button 
            onClick={() => window.location.href = '/user/events/discover'}
          >
            Discover Events
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket._id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event.title}</h3>
                <span className="ticket-status">
                  {ticket.status}
                </span>
              </div>
              
              <div className="ticket-details">
                <div className="ticket-info">
                  <span>Date: {new Date(ticket.event.date).toLocaleDateString()}</span>
                  <span>Location: {ticket.event.venue}</span>
                </div>
                
                <div className="ticket-actions">
                  <button 
                    className="btn-download"
                    onClick={() => handleDownloadTicket(ticket)}
                  >
                    Download Ticket
                  </button>
                  <button 
                    className="btn-qr"
                    onClick={() => {}}
                  >
                    Show QR Code
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

export default UserTickets;