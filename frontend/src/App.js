import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import UserManagement from './pages/Admin/AdminDashboard/UserManagement/UserManagement';
import EventManagement from './pages/Admin/EventManagement/EventManagement';
import SystemHealth from './pages/Admin/SystemHealth/SystemHealth';
import Analytics from './pages/Admin/AdminDashboard/Analytics/UserAnalytics';


// User Pages
import UserDashboard from './pages/User/Dashboard/UserDashboard';
import UserEvents from './pages/User/Events/UserEvents';
import UserTickets from './pages/User/Events/UserTickets';
import UserBookmarks from './pages/User/Events/UserBookmarks';
import ProfileManagement from './pages/User/ProfileManagement/ProfileManagement';
import EventDiscovery from './pages/User/Events/EventDiscovery';
import EventDetails from './pages/User/Events/EventDetails';


// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes - All wrapped in AdminLayout */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="events" element={<EventManagement />} />
                    <Route path="system-health" element={<SystemHealth />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />


          {/* Protected routes for regular users */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserLayout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="profile" element={<ProfileManagement />} />
                    <Route path="bookmarks" element={<UserBookmarks />} />
                    <Route path="events" element={<UserEvents />} />
                    <Route path="events/discover" element={<EventDiscovery />} />
                    <Route path="events/:eventId" element={<EventDetails />} />
                    <Route path="tickets" element={<UserTickets />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </UserLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;