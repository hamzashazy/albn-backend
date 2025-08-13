const Group = require('../models/GroupModel');

// Get all groupes
const getGroups = async (req, res) => {
  try {
    const groupes = await Group.find();
    res.status(200).json(groupes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching groupes: ' + error.message });
  }
};

// Get only active groupes (isDeleted: false)
const getActiveGroups = async (req, res) => {
  try {
    const groupes = await Group.find({ isDeleted: false });
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
    const { name, murabbi } = req.body;

    if (!name || !murabbi) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const groupExists = await Group.findOne({ name });
    if (groupExists) {
      return res.status(400).json({ message: 'Group already exists' });
    }

    const newGroup = await Group.create({ name, murabbi });
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group: ' + error.message });
  }
};

// Update group
const updateGroup = async (req, res) => {
  try {
    const { name, murabbi } = req.body;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (name && name !== group.name) {
      const existingGroup = await Group.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({ message: 'Group name already exists' });
      }
    }

    group.name = name || group.name;
    group.murabbi = murabbi || group.murabbi;

    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Error updating group: ' + error.message });
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
  getActiveGroups, // <-- Add this
};
