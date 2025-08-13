const jwt = require('jsonwebtoken');
const superAdmin = require('../models/superAdminModel');
const Admin = require('../models/AdminModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.Admin = await superAdmin.findById(decoded.id).select('-password');
      if (!req.Admin) {
        return res.status(401).json({ message: 'Not authorized, Admin not found' });
      }

      req.AdminType = decoded.role; // Optional: store role
      return next(); // ✅ important
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // ❌ This will run even if the token block above already ran and failed silently
  // ✅ So move this to an `else` block or add a return above.

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const adminprotect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.Admin = await Admin.findById(decoded.id).select('-password');
      if (!req.Admin) {
        return res.status(401).json({ message: 'Not authorized, Admin not found' });
      }

      req.AdminType = decoded.role; // Optional: store role
      return next(); // ✅ important
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // ❌ This will run even if the token block above already ran and failed silently
  // ✅ So move this to an `else` block or add a return above.

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const protectBoth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await superAdmin.findById(decoded.id).select('-password'); // ✅ lowercase
      let role = 'superadmin';

      if (!user) {
        user = await Admin.findById(decoded.id).select('-password');
        role = 'admin';
      }

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.Admin = user;
      req.AdminType = role;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect, adminprotect, protectBoth };
