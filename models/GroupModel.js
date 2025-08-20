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
  campus: { type: mongoose.Schema.Types.ObjectId,ref: 'Campus', required: true},
  isDeleted: { type: Boolean, default: false},
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', GroupSchema);
