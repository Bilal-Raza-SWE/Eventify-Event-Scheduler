import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import './ActivityFeed.css';

const ActivityFeed = ({ activities }) => {
  const getActivityStyle = (type) => {
    const styles = {
      'user_registration': { icon: '👤', color: '#4CAF50' },
      'event_created': { icon: '📅', color: '#2196F3' },
      'event_updated': { icon: '✏️', color: '#FF9800' },
      'user_login': { icon: '🔑', color: '#9C27B0' },
      'booking_made': { icon: '🎫', color: '#F44336' }
    };
    return styles[type] || { icon: '📌', color: '#757575' };
  };

  return (
    <div className="activity-feed-card">
      <div className="card-header">
        <h3>Recent Activity</h3>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="activities-list">
        {activities?.map((activity, index) => {
          const style = getActivityStyle(activity.type);
          
          return (
            <div key={index} className="activity-item">
              <div 
                className="activity-icon"
                style={{ backgroundColor: `${style.color}15` }}
              >
                {style.icon}
              </div>
              
              <div className="activity-details">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-time">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <button className="activity-action">
                View
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;