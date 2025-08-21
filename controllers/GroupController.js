const Group = require('../models/GroupModel');
const Admin = require('../models/AdminModel');

// Get all groupes
const getGroups = async (req, res) => {
  try {
    const groupes = await Group.find().populate('campus', 'name');
    res.status(200).json(groupes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groupes: ' + error.message });
  }
};

// Get only active groupes (isDeleted: false)
const getActiveGroups = async (req, res) => {
  try {
    const groupes = await Group.find({ isDeleted: false }).populate('campus', 'name');
    res.status(200).json(groupes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active groupes: ' + error.message });
  }
};


// Get group by ID
const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group: ' + error.message });
  }
};

// Create new group
const createGroup = async (req, res) => {
  try {
    const { name, murabbi, campus } = req.body;

    if (!name || !murabbi || !campus) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const groupExists = await Group.findOne({ name });
    if (groupExists) {
      return res.status(400).json({ message: 'Group already exists' });
    }

    const newGroup = await Group.create({ name, murabbi, campus });
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group: ' + error.message });
  }
};

const getGroupsByCampus = async (req, res, next) => {
  try {
    const campusId = req.Admin?.campus; // ✅ match middleware

    if (!campusId) {
      return res.status(400).json({ message: 'Campus not assigned to user' });
    }

    const groups = await Group.find({ campus: campusId })
      .populate('campus', 'name')

    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
};

const createGroupfromAdmin = async (req, res) => {
  try {
    // Find the logged-in admin
    const admin = await Admin.findById(req.Admin._id).select('campus');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Force campus to admin's campus
    req.body.campus = admin.campus;

    const group = await Group.create(req.body);

    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// @desc    Update program
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Group.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group marked as deleted successfully', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group restored successfully', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  restoreGroup,
  getActiveGroups,
  getGroupsByCampus,
  createGroupfromAdmin, // <-- Add this
};
