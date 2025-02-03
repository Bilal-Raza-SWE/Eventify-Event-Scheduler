const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  ticketNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

RegistrationSchema.pre('save', function(next) {
  if (!this.ticketNumber) {
    this.ticketNumber = `TKT-${this.event}-${this.user}-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Registration', RegistrationSchema);