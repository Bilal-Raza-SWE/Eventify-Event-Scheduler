const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const userEventRoutes = require('./routes/userEventRoutes');

require('./models/Bookmark');
require('./models/Event');
require('./models/User');
require('./models/Ticket');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads/events');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}
// Connect Database
connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/user', userEventRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;