const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
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
  startingDate: {
    type: Date,
    required: true,
    trim: true
  },
  endingDate: {
    type: Date,
    required: true,
    trim: true
  },
  campus: { type: mongoose.Schema.Types.ObjectId,ref: 'Campus', required: true},
  program: { type: mongoose.Schema.Types.ObjectId,ref: 'Program', required: true},
  isDeleted: { type: Boolean, default: false},
}, {
  timestamps: true
});

module.exports = mongoose.model('Batch', BatchSchema);
