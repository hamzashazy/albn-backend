const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  murabbi: {
    type: String,
    required: true,
    trim: true
  },
  isDeleted: { type: Boolean, default: false},
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);
