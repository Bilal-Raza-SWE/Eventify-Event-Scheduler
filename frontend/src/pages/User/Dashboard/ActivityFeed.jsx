import React from 'react';
import { 
  FaCalendarCheck, 
  FaUserPlus, 
  FaBell, 
  FaComment,
  FaClock
} from 'react-icons/fa';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const getActivityIcon = (type) => {
    const icons = {
      registration: <FaCalendarCheck />,
      join: <FaUserPlus />,
      reminder: <FaBell />,
      comment: <FaComment />
    };
    return icons[type] || <FaClock />;
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    }
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const activities = [
    {
      id: 1,
      type: 'registration',
      message: 'You registered for "Tech Conference 2024"',
      timestamp: new Date(Date.now() - 30 * 60000),
      eventId: '123'
    },
    {
      id: 2,
      type: 'reminder',
      message: '"Web Development Workshop" starts in 2 hours',
      timestamp: new Date(Date.now() - 120 * 60000),
      eventId: '456'
    },
    {
      id: 3,
      type: 'join',
      message: '5 new attendees joined your "Networking Mixer"',
      timestamp: new Date(Date.now() - 240 * 60000),
      eventId: '789'
    }
  ];

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3>Recent Activity</h3>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="activities">
        {activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.type}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-time">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-activity">
            <p>No recent activity to show</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;