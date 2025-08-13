const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true }, // hash in controller before saving

  campus:  { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true }, 
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  group:   { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true},
  isDeleted: { type: Boolean, default: false},
  
  createdAt: { type: Date, default: Date.now }
});

StudentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

StudentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', StudentSchema);
