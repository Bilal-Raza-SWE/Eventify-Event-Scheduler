import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendar, FaClock, FaGlobe } from 'react-icons/fa';
import './UserActivityModal.css';

const UserActivityModal = ({ user, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUserActivities();
  }, [user.id]);

  const fetchUserActivities = async () => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/activities`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      login: '🔑',
      registration: '👤',
      profile_update: '✏️',
      password_change: '🔒',
      event_registration: '📅',
      payment: '💳'
    };
    return icons[type] || '📌';
  };

  const filteredActivities = activities.filter(activity => 
    filterType === 'all' || activity.type === filterType
  );

  return (
    <div className="modal-overlay">
      <div className="activity-modal">
        <div className="modal-header">
          <div className="user-profile">
            <img src={user.avatar} alt={user.name} className="modal-avatar" />
            <div className="user-details">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="activity-filters">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="profile_update">Profile Updates</option>
            <option value="event_registration">Event Registrations</option>
            <option value="payment">Payments</option>
          </select>
        </div>

        <div className="activity-timeline">
          {isLoading ? (
            <div className="loading-spinner">Loading activities...</div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-description">
                    {activity.description}
                  </p>
                  <div className="activity-meta">
                    <span>
                      <FaCalendar />
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                    <span>
                      <FaClock />
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                    <span>
                      <FaGlobe />
                      {activity.ipAddress}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserActivityModal;