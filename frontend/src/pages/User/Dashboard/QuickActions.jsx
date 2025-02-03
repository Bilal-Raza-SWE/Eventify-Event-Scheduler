import React from 'react';
import { 
  FaCalendarPlus, 
  FaSearch, 
  FaBookmark, 
  FaCog,
  FaTicketAlt
} from 'react-icons/fa';
import './QuickActions.css';

const QuickActions = ({ onCreateEvent }) => {
  const actions = [
    {
      icon: <FaCalendarPlus />,
      title: 'Create Event',
      description: 'Host a new event',
      action: onCreateEvent,
      primary: true
    },
    {
      icon: <FaSearch />,
      title: 'Find Events',
      description: 'Discover events near you',
      action: () => window.location.href = '/user/events'
    },
    {
      icon: <FaBookmark />,
      title: 'Saved Events',
      description: 'View your bookmarks',
      action: () => window.location.href = '/user/bookmarks'
    },
    {
      icon: <FaTicketAlt />,
      title: 'My Tickets',
      description: 'Access your tickets',
      action: () => window.location.href = '/user/tickets'
    },
    {
      icon: <FaCog />,
      title: 'Preferences',
      description: 'Update settings',
      action: () => window.location.href = '/settings'
    }
  ];

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`action-card ${action.primary ? 'primary' : ''}`}
            onClick={action.action}
          >
            <div className="action-icon">
              {action.icon}
            </div>
            <h4>{action.title}</h4>
            <p>{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;