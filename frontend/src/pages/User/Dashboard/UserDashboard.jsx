import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../../context/AuthContext';
import { 
  FaCalendarPlus, 
  FaList, 
  FaHistory, 
  FaStar 
} from 'react-icons/fa';
import CreatedEventsList from './CreatedEventsList';
import RegisteredEventsList from './RegisteredEventsList';
import CreateEventModal from './CreateEventModal';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import { eventService } from '../../../services/api';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserDashboard.css';
import UserTickets from '../Events/UserTickets';

const localizer = momentLocalizer(moment);

const UserDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [activeTab, setActiveTab] = useState('created');
  const [events, setEvents] = useState({
    created: [],
    registered: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetchUserEvents();
  }, [currentUser, navigate]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const [createdEvents, registeredEvents] = await Promise.all([
        eventService.getUserCreatedEvents(),
        eventService.getUserRegisteredEvents()
      ]);
      
      setEvents({
        created: createdEvents,
        registered: registeredEvents
      });
    } catch (err) {
      console.error('Error fetching events:', err);
      if (err.message === 'Not authorized, no token') {
        navigate('/login');
      } else {
        setError('Failed to fetch events. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

   // Handle event creation
   const handleEventCreation = async (eventData) => {
    try {
      await eventService.createEvent(eventData);
      await fetchUserEvents();
      setShowCreateEventModal(false);
    } catch (err) {
      if (err.message === 'Not authorized, no token') {
        navigate('/login');
      } else {
        setError(err.message);
      }
    }
  };

  // Combine all events for calendar view
  const calendarEvents = [
    ...events.created.map(event => ({
      ...event,
      title: `(Created) ${event.title}`,
      start: new Date(event.startDate),
      end: new Date(event.endDate)
    })),
    ...events.registered.map(event => ({
      ...event,
      title: `(Registered) ${event.title}`,
      start: new Date(event.startDate),
      end: new Date(event.endDate)
    }))
  ];

  // Error handling and loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchUserEvents}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-grid">
        <QuickActions onCreateEvent={() => setShowCreateEventModal(true)} />
        
        <div className="calendar-section">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>

      <div className="events-section">
        <div className="events-tabs">
          <button
            className={`tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <FaList /> Events You Created
          </button>
          <button
            className={`tab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            <FaStar /> Events You're Attending
          </button>
        </div>

        <div className="events-content">
          {activeTab === 'created' ? (
            <CreatedEventsList events={events.created} onEventUpdate={fetchUserEvents} />
          ) : (
            <RegisteredEventsList events={events.registered} onCancelRegistration={fetchUserEvents} />,
            <UserTickets events={events.registered}/>
          )}
        </div>
      </div>

      <ActivityFeed />

      {showCreateEventModal && (
        <CreateEventModal
          onClose={() => setShowCreateEventModal(false)}
          onEventCreated={handleEventCreation}
        />
      )}
    </div>
  );
};

export default UserDashboard;