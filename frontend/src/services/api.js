import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const API_URL1 = 'http://localhost:3001/api/events';
const API_URL2 = 'http://localhost:3001/api/user';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
export const eventService = {
  // Create a new event
  createEvent: async (eventData) => {
    console.log(eventData);
    const response = await fetch(API_URL1, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    console.log(response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create event');
    }

    return response.json();
  },

  // Get user's created events
  getUserCreatedEvents: async () => {
    const response = await fetch(`${API_URL1}/created`,{
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch created events');
    }

    return response.json();
  },
  // Fetch all events with optional filters
  async getAllEvents(filters = {}) {
    try {
      const response = await api.get('/events', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch events. Please try again.'
      );
    }
  },

    // Register for an event
  async registerForEvent(eventId) {
    try {
      const response = await api.post(`/events/${eventId}/register`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Event registration failed. Please try again.'
      );
    }
  },
  
  // Get user's registered events
  getUserRegisteredEvents: async () => {
    const response = await fetch(`${API_URL1}/registered`,
      {
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch registered events');
    }

    return response.json();
  },

  // Get user's upcoming events
  getUserUpcomingEvents: async () => {
    const response = await fetch(`${API_URL1}/upcoming`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch upcoming events');
    }

    return response.json();
  },

  // Get user's past events
  getUserPastEvents: async () => {
    const response = await fetch(`${API_URL1}/past`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch past events');
    }

    return response.json();
  },


  getAllAdminEvents: async (filters = {}) => {
    try {
      const response = await fetch(`${API_URL1}/admin`, {
        method: 'GET',
        headers: getAuthHeaders(),
        body: JSON.stringify(filters)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch events');
      }
  
      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch events. Please try again.'
      );
    }
  },
  
  // Approve an event
  approveEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_URL1}/${eventId}/approve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve event');
      }
  
      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to approve event. Please try again.'
      );
    }
  },
  
  // Reject an event
  rejectEvent: async (eventId) => {
    try {
      const response = await fetch(`${API_URL1}/${eventId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject event');
      }
  
      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to reject event. Please try again.'
      );
    }
  },
  
  // Feature/Unfeature an event
  toggleEventFeature: async (eventId) => {
    try {
      const response = await fetch(`${API_URL1}/${eventId}/feature`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update event feature status');
      }
  
      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to update event feature status. Please try again.'
      );
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    const response = await fetch(`${API_URL1}/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()

    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete event');
    }

    return response.json();
  },



  getUserTickets: async () => {
    const response = await fetch(`${API_URL2}/tickets`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tickets');
    }

    return response.json();
  },

  generateTicketQR: async (ticketId) => {
    const response = await fetch(`${API_URL2}/tickets/${ticketId}/qr`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate QR code');
    }

    return response.json();
  },

  // Bookmark-related functions
  getUserBookmarks: async () => {
    const response = await fetch(`${API_URL2}/bookmarks`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch bookmarks');
    }

    return response.json();
  },

  addBookmark: async (eventId) => {
    const response = await fetch(`${API_URL2}/bookmarks/${eventId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add bookmark');
    }

    return response.json();
  },

  removeBookmark: async (eventId) => {
    const response = await fetch(`${API_URL2}/bookmarks/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove bookmark');
    }

    return response.json();
  }

};

const API_URL_ADMIN = 'http://localhost:3001/api/admin';

export const adminService = {
  // Fetch users with optional filters
  async getAllUsers(filters = {}) {
    try {
      const response = await fetch(`${API_URL_ADMIN}/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
      }

      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch users. Please try again.'
      );
    }
  },

  // Update user details
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_URL_ADMIN}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to update user. Please try again.'
      );
    }
  },

  // Change user status (activate/deactivate)
  async changeUserStatus(userId, status) {
    try {
      const response = await fetch(`${API_URL_ADMIN}/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change user status');
      }

      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to change user status. Please try again.'
      );
    }
  },

  // Get user details
  async getUserDetails(userId) {
    try {
      const response = await fetch(`${API_URL_ADMIN}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user details');
      }

      return response.json();
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch user details. Please try again.'
      );
    }
  }
};


export default api;