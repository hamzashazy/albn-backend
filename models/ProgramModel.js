const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  campus: { type: mongoose.Schema.Types.ObjectId,ref: 'Campus', required: true},
  createdAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: { type: Boolean, default: false},
});

module.exports = mongoose.model('Program', programSchema);
