import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaEdit 
} from 'react-icons/fa';
import { eventService } from '../../../services/api'; 
import EventDetailsModal from './EventDetailsModal';
import CategoryManagement from './CategoryManagement';
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    timeFrame: 'all',
    search: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await eventService.getAllAdminEvents(filters);
      setEvents(fetchedEvents);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setIsLoading(false);
    }
  };

  const handleEventAction = async (eventId, action) => {
    try {
      let updatedEvent;
      if (action === 'approve') {
        updatedEvent = await eventService.approveEvent(eventId);
      } else if (action === 'reject') {
        updatedEvent = await eventService.rejectEvent(eventId);
      }

      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === eventId ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
    }
  };

  const handleFeatureEvent = async (eventId) => {
    try {
      const updatedEvent = await eventService.toggleEventFeature(eventId);
      
      // Update local state
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error('Error featuring event:', error);
    }
  };

  const getEventTimeframe = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (endDate < now) return 'past';
    if (startDate > now) return 'upcoming';
    return 'ongoing';
  };

  const filteredEvents = events.filter(event => {
    const matchesTimeframe = 
      filters.timeFrame === 'all' || 
      getEventTimeframe(event) === filters.timeFrame;
    
    const matchesCategory = 
      filters.category === 'all' || 
      event.category === filters.category;
    
    const matchesSearch = 
      !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase());

    return matchesTimeframe && matchesCategory && matchesSearch;
  });

  return (
    <div className="event-management">
      <div className="page-header">
        <h2>Event Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCategoryModal(true)}
        >
          Manage Categories
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="search-input"
        />

        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.timeFrame}
            onChange={(e) => setFilters(prev => ({ ...prev, timeFrame: e.target.value }))}
          >
            <option value="all">All Time</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      <div className="events-table-container">
        {isLoading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Organizer</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event._id}>
                  <td className="event-cell">
                    <div className="event-info">
                      <img 
                        src={event.image || '/default-event-image.png'} 
                        alt={event.title} 
                      />
                      <div>
                        <h4>{event.title}</h4>
                        <span className="event-category">{event.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {event.organizer 
                      ? `${event.organizer.firstName} ${event.organizer.lastName}` 
                      : 'Unknown'}
                  </td>
                  <td>
                    <div className="event-datetime">
                      <span>{new Date(event.startDate).toLocaleDateString()}</span>
                      <span>{new Date(event.startDate).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${event.status}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`feature-btn ${event.featured ? 'featured' : ''}`}
                      onClick={() => handleFeatureEvent(event._id)}
                    >
                      <FaStar />
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowDetailsModal(true);
                      }}
                    >
                      View
                    </button>
                    {event.status === 'pending' && (
                      <>
                        <button
                          className="action-btn approve"
                          onClick={() => handleEventAction(event._id, 'approve')}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleEventAction(event._id, 'reject')}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryManagement
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
};

export default EventManagement;