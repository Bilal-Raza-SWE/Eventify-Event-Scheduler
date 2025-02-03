const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['active', 'used', 'cancelled'],
    default: 'active'
  },
  registrationId: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: String,
  purchaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

TicketSchema.pre('save', async function(next) {
  if (!this.registrationId) {
    this.registrationId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = {
    Ticket
};