const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserTickets,
  getUserBookmarks,
  addBookmark,
  removeBookmark
} = require('../controllers/userEventController');

// Ticket routes
router.get('/tickets', protect, getUserTickets);

// Bookmark routes
router.get('/bookmarks', protect, getUserBookmarks);
router.post('/bookmarks/:eventId', protect, addBookmark);
router.delete('/bookmarks/:eventId', protect, removeBookmark);

module.exports = router;