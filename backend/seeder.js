const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Comment = require('./models/Comments');
const Bookmark = require('./models/Bookmark');

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed Users
const seedUsers = async () => {
  try {
    await User.deleteMany({});

    const users = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123!',
        role: 'user'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'AdminPass456!',
        role: 'admin'
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        password: 'UserPass789!',
        role: 'user'
      }
    ];

    return await User.create(users);
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed Events
const seedEvents = async (users) => {
  try {
    await Event.deleteMany({});

    const events = [
      {
        title: 'Tech Innovation Conference 2024',
        description: 'Explore the latest trends in technology and innovation',
        category: 'technology',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-17'),
        startTime: '09:00',
        endTime: '17:00',
        venue: 'Convention Center',
        address: '123 Tech Street, San Francisco, CA',
        capacity: 500,
        image: 'https://example.com/tech-conference.jpg',
        isPublic: true,
        price: 299.99,
        creator: users[1]._id
      },
      {
        title: 'Business Networking Mixer',
        description: 'Connect with industry professionals and expand your network',
        category: 'business',
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-07-10'),
        startTime: '18:00',
        endTime: '22:00',
        venue: 'Grand Hotel Ballroom',
        address: '456 Business Avenue, New York, NY',
        capacity: 200,
        image: 'https://example.com/networking-event.jpg',
        isPublic: true,
        price: 0,
        creator: users[0]._id
      },
      {
        title: 'Sports Innovation Summit',
        description: 'Discover cutting-edge technologies in sports and athletics',
        category: 'sports',
        startDate: new Date('2024-08-20'),
        endDate: new Date('2024-08-22'),
        startTime: '10:00',
        endTime: '16:00',
        venue: 'Sports Complex',
        address: '789 Stadium Road, Chicago, IL',
        capacity: 300,
        image: 'https://example.com/sports-summit.jpg',
        isPublic: true,
        price: 199.50,
        creator: users[2]._id
      }
    ];

    return await Event.create(events);
  } catch (error) {
    console.error('Error seeding events:', error);
  }
};

// Seed Registrations
const seedRegistrations = async (users, events) => {
  try {
    await Registration.deleteMany({});

    const registrations = [
      {
        user: users[0]._id,
        event: events[0]._id,
        status: 'confirmed'
      },
      {
        user: users[1]._id,
        event: events[1]._id,
        status: 'confirmed'
      },
      {
        user: users[2]._id,
        event: events[2]._id,
        status: 'confirmed'
      }
    ];

    return await Registration.create(registrations);
  } catch (error) {
    console.error('Error seeding registrations:', error);
  }
};

// Seed Comments
const seedComments = async (users, events) => {
  try {
    await Comment.deleteMany({});

    const comments = [
      {
        text: 'Excited about this tech conference!',
        user: users[0]._id,
        event: events[0]._id
      },
      {
        text: 'Great networking opportunity!',
        user: users[1]._id,
        event: events[1]._id
      },
      {
        text: 'Looking forward to learning about sports technology.',
        user: users[2]._id,
        event: events[2]._id
      }
    ];

    return await Comment.create(comments);
  } catch (error) {
    console.error('Error seeding comments:', error);
  }
};

// Seed Bookmarks
const seedBookmarks = async (users, events) => {
  try {
    await Bookmark.deleteMany({});

    const bookmarks = [
      {
        user: users[0]._id,
        event: events[1]._id
      },
      {
        user: users[1]._id,
        event: events[2]._id
      }
    ];

    return await Bookmark.create(bookmarks);
  } catch (error) {
    console.error('Error seeding bookmarks:', error);
  }
};

// Main Seeding Function
const seedDatabase = async () => {
  try {
    await connectDB();

    const users = await seedUsers();
    const events = await seedEvents(users);
    
    await seedRegistrations(users, events);
    await seedComments(users, events);
    await seedBookmarks(users, events);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();