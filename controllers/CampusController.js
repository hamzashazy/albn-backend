const Campus = require('../models/CampusModel');

// Get all campuses
const getCampuses = async (req, res) => {
  try {
    const campuses = await Campus.find();
    res.status(200).json(campuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campuses: ' + error.message });
  }
};

// Get only active campuses (isDeleted: false)
const getActiveCampuses = async (req, res) => {
  try {
    const campuses = await Campus.find({ isDeleted: false });
    res.status(200).json(campuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active campuses: ' + error.message });
  }
};


// Get campus by ID
const getCampusById = async (req, res) => {
  try {
    const campusId = req.params.id;
    const campus = await Campus.findById(campusId);

    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    res.status(200).json(campus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campus: ' + error.message });
  }
};

// Create new campus
const createCampus = async (req, res) => {
  try {
    const { name, city, zimedaar, founding_date } = req.body;

    if (!name || !city || !zimedaar || !founding_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const campusExists = await Campus.findOne({ name });
    if (campusExists) {
      return res.status(400).json({ message: 'Campus already exists' });
    }

    const newCampus = await Campus.create({ name, city, zimedaar, founding_date });
    res.status(201).json(newCampus);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campus: ' + error.message });
  }
};

// Update campus
const updateCampus = async (req, res) => {
  try {
    const { name, city, zimedaar, founding_date } = req.body;
    const campusId = req.params.id;

    const campus = await Campus.findById(campusId);
    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    if (name && name !== campus.name) {
      const existingCampus = await Campus.findOne({ name });
      if (existingCampus) {
        return res.status(400).json({ message: 'Campus name already exists' });
      }
    }

    campus.name = name || campus.name;
    campus.city = city || campus.city;
    campus.zimedaar = zimedaar || campus.zimedaar;
    campus.founding_date = founding_date || campus.founding_date;

    const updatedCampus = await campus.save();
    res.status(200).json(updatedCampus);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campus: ' + error.message });
  }
};

// Delete campus
const deleteCampus = async (req, res) => {
  try {
    const campus = await Campus.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    res.status(200).json({ message: 'Campus marked as deleted successfully', campus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreCampus = async (req, res) => {
  try {
    const campus = await Campus.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!campus) {
      return res.status(404).json({ message: 'Campus not found' });
    }

    res.status(200).json({ message: 'Campus restored successfully', campus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCampuses,
  getCampusById,
  createCampus,
  updateCampus,
  deleteCampus,
  restoreCampus,
  getActiveCampuses, // <-- Add this
};
