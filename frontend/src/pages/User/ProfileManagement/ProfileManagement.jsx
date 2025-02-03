import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaImage } from 'react-icons/fa';
import './ProfileManagement.css';

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    interests: []
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    try {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ submit: 'Failed to update password' });
    }
  };

  return (
    <div className="profile-management">
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src={profileImage || '/default-avatar.png'} 
            alt="Profile" 
            className="profile-image"
          />
          <label className="image-upload-btn">
            <FaImage />
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </label>
        </div>
        <h2>{`${profileData.firstName} ${profileData.lastName}`}</h2>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FaUser /> Personal Information
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock /> Security
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'personal' ? (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      firstName: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      lastName: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      email: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      phone: e.target.value
                    })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      bio: e.target.value
                    })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-actions">
                {isEditing ? (
                  <>
                    <button type="submit" className="btn-save">
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })}
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="btn-save">
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;