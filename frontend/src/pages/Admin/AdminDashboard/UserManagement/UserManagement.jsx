import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUserEdit, FaBan } from 'react-icons/fa';
import UserEditModal from './UserEditModal';
import UserActivityModal from './UserActivityModal';
import { adminService } from '../../../../services/api'; 
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    role: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const users = await adminService.getAllUsers({
        role: filters.role === 'all' ? '' : filters.role,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });
      setUsers(users);
      setFilteredUsers(users);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleUserStatusToggle = async (userId) => {
    try {
      const userToUpdate = users.find(u => u._id === userId);
      const newStatus = userToUpdate.status === 'active' ? 'inactive' : 'active';
      
      const updatedUser = await adminService.updateUserStatus(userId, newStatus);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? updatedUser : user
        )
      );
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? updatedUser : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="user-management">
      <div className="filters-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Date Joined</option>
            <option value="firstName">Name</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="loading">Loading users...</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td className="user-cell">
                    <div className="user-info">
                      <span className="user-name">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      className="action-btn toggle-status"
                      onClick={() => handleUserStatusToggle(user._id)}
                    >
                      <FaBan />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUserUpdate={(updatedUser) => {
            setUsers(prevUsers =>
              prevUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user
              )
            );
            setFilteredUsers(prevUsers =>
              prevUsers.map(user =>
                user._id === updatedUser._id ? updatedUser : user
              )
            );
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;