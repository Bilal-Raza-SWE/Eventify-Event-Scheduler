const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Bookmark = require('../models/Bookmark');
const Comment = require('../models/Comments');
const Ticket = require('../models/Ticket');
const qr = require('qrcode');
// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      startDate, 
      endDate, 
      startTime, 
      endTime, 
      venue, 
      address, 
      capacity, 
      isPublic, 
      price 
    } = req.body;

    // Create event object
    const eventData = {
      title,
      description,
      category,
      startDate,
      endDate,
      startTime,
      endTime,
      venue,
      address,
      capacity: parseInt(capacity),
      isPublic: isPublic === 'true',
      price: parseFloat(price) || 0,
      creator: req.user._id
    };

    // If there's an uploaded image, add its path
    if (req.file) {
      eventData.image = `/uploads/events/${req.file.filename}`;
    }

    // Create new event
    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating event', 
      error: error.message 
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    // Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    if (event.creator.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this event' 
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getUserUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    
    // Get both created and registered events
    const [createdEvents, registeredEvents] = await Promise.all([
      Event.find({
        creator: req.user._id,
        startDate: { $gt: now }
      }),
      
      Registration.find({
        user: req.user._id,
        status: 'confirmed'
      }).populate({
        path: 'event',
        match: { startDate: { $gt: now } }
      })
    ]);

    const upcomingRegisteredEvents = registeredEvents
      .map(reg => reg.event)
      .filter(event => event !== null);

    const allUpcomingEvents = [...createdEvents, ...upcomingRegisteredEvents]
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    res.json(allUpcomingEvents);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

// Get user's past events
exports.getUserPastEvents = async (req, res) => {
  try {
    const now = new Date();
    
    const [createdEvents, registeredEvents] = await Promise.all([
      Event.find({
        creator: req.user._id,
        endDate: { $lt: now }
      }),
      
      Registration.find({
        user: req.user._id,
        status: 'confirmed'
      }).populate({
        path: 'event',
        match: { endDate: { $lt: now } }
      })
    ]);

    const pastRegisteredEvents = registeredEvents
      .map(reg => reg.event)
      .filter(event => event !== null);

    const allPastEvents = [...createdEvents, ...pastRegisteredEvents]
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    res.json(allPastEvents);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching past events',
      error: error.message
    });
  }
};
// Get all events with filtering
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      category, 
      date, 
      location, 
      search 
    } = req.query;

    let query = {};

    // Apply filters
    if (category) query.category = category;
    if (date) {
      query.startDate = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      };
    }
    if (location) {
      query.$or = [
        { venue: { $regex: location, $options: 'i' } },
        { address: { $regex: location, $options: 'i' } }
      ];
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching events', 
      error: error.message 
    });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate({
        path: 'event',
        select: 'title venue startDate endDate image description'
      })
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching tickets', 
      error: error.message 
    });
  }
};

// Generate ticket QR code
exports.generateTicketQR = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.ticketId,
      user: req.user._id
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Generate QR code for ticket
    const qrData = {
      ticketId: ticket._id,
      registrationId: ticket.registrationId,
      eventId: ticket.event
    };

    const qrCode = await qr.toDataURL(JSON.stringify(qrData));
    
    // Update ticket with QR code
    ticket.qrCode = qrCode;
    await ticket.save();

    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error generating QR code', 
      error: error.message 
    });
  }
};

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

// Add bookmark
exports.addBookmark = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      event: eventId
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Event already bookmarked' });
    }

    // Create new bookmark
    const bookmark = new Bookmark({
      user: req.user._id,
      event: eventId
    });

    await bookmark.save();
    
    const populatedBookmark = await Bookmark.findById(bookmark._id)
      .populate('event');

    res.status(201).json(populatedBookmark);
  } catch (error) {
    res.status(500).json({ 
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
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error removing bookmark', 
      error: error.message 
    });
  }
}


// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check event capacity
    if (event.registeredAttendees >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: event._id
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration
    const registration = new Registration({
      user: req.user._id,
      event: event._id
    });

    await registration.save();

    // Update event registered attendees
    event.registeredAttendees += 1;
    event.registrations.push(registration._id);
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering for event', 
      error: error.message 
    });
  }
};

// Bookmark an event
exports.bookmarkEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      event: event._id
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Event already bookmarked' });
    }

    // Create bookmark
    const bookmark = new Bookmark({
      user: req.user._id,
      event: event._id
    });

    await bookmark.save();

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error bookmarking event', 
      error: error.message 
    });
  }
};

// Add comment to an event
exports.addComment = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const comment = new Comment({
      text: req.body.text,
      user: req.user._id,
      event: event._id
    });

    await comment.save();

    // Add comment to event
    event.comments.push(comment._id);
    await event.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error adding comment', 
      error: error.message 
    });
  }
};

// Get user's created events
exports.getUserCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching created events', 
      error: error.message 
    });
  }
};

// Get user's registered events
exports.getUserRegisteredEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ 
      user: req.user._id,
      status: 'confirmed'
    }).populate('event');

    const events = registrations.map(reg => reg.event);
    res.json(events);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching registered events', 
      error: error.message 
    });
  }
};

// Get all events with filtering for admin
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      status = '',
      category = '',
      timeFrame = '',
      search = ''
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Status filter
    if (status) filter.status = status;
    
    // Category filter
    if (category && category !== 'all') filter.category = category;
    
    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Timeframe filter
    const now = new Date();
    if (timeFrame === 'upcoming') {
      filter.startDate = { $gt: now };
    } else if (timeFrame === 'ongoing') {
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    } else if (timeFrame === 'past') {
      filter.endDate = { $lt: now };
    }

    // Sort by most recent first
    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .populate('organizer', 'firstName lastName email'); 

    res.json(events);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching events', 
      error: error.message 
    });
  }
};

// Approve an event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      { status: 'approved' }, 
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error approving event', 
      error: error.message 
    });
  }
};

// Reject an event
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      { status: 'rejected' }, 
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error rejecting event', 
      error: error.message 
    });
  }
};

// Feature/Unfeature an event
exports.featureEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.featured = !event.featured;
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating event feature status', 
      error: error.message 
    });
  }
};