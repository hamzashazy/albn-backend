const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isDeleted: { type: Boolean, default: false},
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);
