const SuperAdmin = require('../models/superAdminModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const exists = await SuperAdmin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Super admin already exists' });
    }

    const created = await SuperAdmin.create({ email, password });
    res.status(201).json({
      _id: created._id,
      email: created.email,
      token: generateToken(created._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await SuperAdmin.findOne({ email }).select('+password'); // if password is select:false

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerSuperAdmin, loginSuperAdmin };
