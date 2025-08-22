const Admin = require('../models/AdminModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc   Get all admins (excluding passwords)
const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().populate('campus', 'name');
    res.status(200).json(admins);
  } catch (err) {
    next(err);
  }
};

// @desc   Register new admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, campus, cnic } = req.body;

    // Validate input
    if (!name || !email || !password || !campus || cnic === undefined) {
      return res.status(400).json({ message: 'Please provide all relevant details' });
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = await Admin.create({ name, email, password, campus, cnic });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      campus: admin.campus,
      cnic: admin.cnic,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email, isDeleted: false });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        campus: admin.campus,
        cnic: admin.cnic,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update admin
const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const { name, email, password, campus, cnic } = req.body;

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (campus) admin.campus = campus;
    if (cnic !== undefined) admin.cnic = cnic;
    if (password) admin.password = password; // bcrypt handled in pre-save

    const updatedAdmin = await admin.save();

    res.status(200).json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      campus: updatedAdmin.campus,
      cnic: updatedAdmin.cnic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin marked as deleted successfully', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin restored successfully', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getAdminById, // <-- Add this
  updateAdmin,
  deleteAdmin,
  restoreAdmin, // <-- Add this
};
