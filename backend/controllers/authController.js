const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registrationSchema, loginSchema } = require('../utils/validationSchemas');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      adminCode 
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    if (role === 'admin') {
      if (adminCode && adminCode !== 'ADMIN123') {
        return res.status(400).json({ 
          message: 'Invalid admin verification code' 
        });
      }
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      adminCode: role === 'admin' && adminCode ? adminCode : null
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: error.details[0].message 
      });
    }

    const { email, password, role } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Verify role
    if (user.role !== role) {
      return res.status(403).json({ 
        message: 'Invalid role access' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const { 
      search = '', 
      status = '', 
      role = '', 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filter.status = status;
    if (role) filter.role = role;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Fetch users with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password'); // Exclude password

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user by ID (Admin only)
exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: id } 
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { 
        firstName, 
        lastName, 
        email, 
        role 
      }, 
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Deactivate/Activate user (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { status }, 
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};
