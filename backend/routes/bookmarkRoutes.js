const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserBookmarks,
  removeBookmark
} = require('../controllers/bookmarkController');

// Get user's bookmarks
router.get('/', protect, getUserBookmarks);

// Remove a bookmark
router.delete('/:bookmarkId', protect, removeBookmark);

module.exports = router;