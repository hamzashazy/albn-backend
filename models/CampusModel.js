const mongoose = require('mongoose');

const CampusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  zimedaar: {
    type: String,
    required: true,
    trim: true
  },
  founding_date: {
    type: Date,
    required: true,
    trim: true
  },
  isDeleted: { type: Boolean, default: false},
}, {
  timestamps: true
});

module.exports = mongoose.model('Campus', CampusSchema);
