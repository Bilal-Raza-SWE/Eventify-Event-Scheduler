import React from 'react';
import { 
  FaUserPlus, 
  FaCalendarPlus, 
  FaBan, 
  FaBell,
  FaCog,
  FaFileAlt 
} from 'react-icons/fa';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    {
      icon: <FaUserPlus />,
      title: 'Add User',
      description: 'Create new user account',
      color: '#4CAF50'
    },
    {
      icon: <FaCalendarPlus />,
      title: 'Create Event',
      description: 'Set up new event',
      color: '#2196F3'
    },
    {
      icon: <FaBell />,
      title: 'Announcement',
      description: 'Send system announcement',
      color: '#FF9800'
    },
    {
      icon: <FaFileAlt />,
      title: 'Generate Report',
      description: 'Create system report',
      color: '#9C27B0'
    },
    {
      icon: <FaBan />,
      title: 'Block User',
      description: 'Restrict user access',
      color: '#F44336'
    },
    {
      icon: <FaCog />,
      title: 'Settings',
      description: 'System configuration',
      color: '#607D8B'
    }
  ];

  const handleActionClick = (action) => {
    console.log(`Clicked: ${action.title}`);
  };

  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h3>Quick Actions</h3>
      </div>

      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-button"
            onClick={() => handleActionClick(action)}
          >
            <div 
              className="action-icon"
              style={{ 
                color: action.color,
                backgroundColor: `${action.color}15`
              }}
            >
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