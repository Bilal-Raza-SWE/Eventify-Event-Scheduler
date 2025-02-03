const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createEvent,
  getAllEvents,
  registerForEvent,
  bookmarkEvent,
  addComment,
  getUserCreatedEvents,
  deleteEvent,
  getUserRegisteredEvents,getUserUpcomingEvents, getUserPastEvents,
  getUserTickets,
  generateTicketQR,
  getUserBookmarks,
  addBookmark,
  removeBookmark
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);

// Protected routes (require authentication)
router.post('/', protect, createEvent);
router.post('/:eventId/register', protect, registerForEvent);
router.post('/:eventId/bookmark', protect, bookmarkEvent);
router.post('/:eventId/comments', protect, addComment);
router.get('/created', protect, getUserCreatedEvents);
router.get('/registered', protect, getUserRegisteredEvents);
router.delete('/:eventId', protect, deleteEvent);

router.get('/upcoming', protect, getUserUpcomingEvents);
router.get('/past', protect, getUserPastEvents);
router.get('/tickets', protect, getUserTickets);
router.get('/tickets/:ticketId/qr', protect, generateTicketQR);

// Bookmark routes
router.get('/bookmarks', protect, getUserBookmarks);
router.post('/bookmarks/:eventId', protect, addBookmark);
router.delete('/bookmarks/:eventId', protect, removeBookmark);

module.exports = router;