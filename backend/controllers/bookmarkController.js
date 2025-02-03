const Bookmark = require('../models/Bookmark');

// Get user's bookmarks
exports.getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });
    
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching bookmarks', 
      error: error.message 
    });
  }
};

// Remove a bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.bookmarkId,
      user: req.user._id
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing bookmark', 
      error: error.message 
    });
  }
};