const Ticket = require('../models/Ticket');
const Bookmark = require('../models/Bookmark');
const Event = require('../models/Event');

// Get user's tickets
exports.getUserTickets = async (req, res) => {
    try {
        // Find all tickets for the current user and populate event details
        const tickets = await Ticket.find({ user: req.user._id })
            .populate({
                path: 'event',
                select: 'title description startDate endDate venue image'
            })
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        console.error('Error in getUserTickets:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching tickets', 
            error: error.message 
        });
    }
};

// Get user's bookmarks
exports.getUserBookmarks = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user._id })
            .populate({
                path: 'event',
                select: 'title description startDate endDate venue image registeredAttendees capacity'
            })
            .sort({ createdAt: -1 });

        res.json(bookmarks);
    } catch (error) {
        console.error('Error in getUserBookmarks:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching bookmarks', 
            error: error.message 
        });
    }
};

exports.addBookmark = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        
        // First, verify that the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        // Check if already bookmarked
        const existingBookmark = await Bookmark.findOne({
            user: req.user._id,
            event: eventId
        });

        if (existingBookmark) {
            return res.status(400).json({
                success: false,
                message: 'Event already bookmarked'
            });
        }

        // Create new bookmark
        const bookmark = new Bookmark({
            user: req.user._id,
            event: eventId
        });

        await bookmark.save();

        // Populate event details before sending response
        const populatedBookmark = await bookmark.populate('event');

        res.status(201).json({
            success: true,
            data: populatedBookmark
        });
    } catch (error) {
        console.error('Error in addBookmark:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding bookmark',
            error: error.message
        });
    }
};

// Remove bookmark
exports.removeBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({
            user: req.user._id,
            event: req.params.eventId
        });

        if (!bookmark) {
            return res.status(404).json({ 
                success: false, 
                message: 'Bookmark not found' 
            });
        }

        res.json({
            success: true,
            message: 'Bookmark removed successfully'
        });
    } catch (error) {
        console.error('Error in removeBookmark:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error removing bookmark', 
            error: error.message 
        });
    }
};