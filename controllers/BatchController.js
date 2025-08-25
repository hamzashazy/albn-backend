const Batch = require('../models/BatchModel');

// @desc    Create new batch
const createBatch = async (req, res) => {
  try {
    const { name, city, startingDate, endingDate,campus,program } = req.body;

    if (!name || !city|| !startingDate || !endingDate|| !campus|| !program) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const batch = await Batch.create({ name, city, startingDate, endingDate,campus,program });
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all batches
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 }).populate('campus', 'name').populate('program', 'name');
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBatchesByCampus = async (req, res, next) => {
  try {
    const campusId = req.Admin?.campus; // ✅ match middleware

    if (!campusId) {
      return res.status(400).json({ message: 'Campus not assigned to user' });
    }

    const batches = await Batch.find({ campus: campusId }).populate('campus', 'name').populate('program', 'name');

    res.status(200).json(batches);
  } catch (err) {
    next(err);
  }
};

// Get only active batches (isDeleted: false)
const getActiveBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ isDeleted: false }).populate('campus', 'name').populate('program', 'name');
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active batches: ' + error.message });
  }
};

// @desc    Get single batch by ID
const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update batch
const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Batch.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete batch
// Delete batch
const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch marked as deleted successfully', batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch restored successfully', batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBatch,
  getBatches,
  getBatchById, // <- added here
  updateBatch,
  deleteBatch,
  restoreBatch,
  getBatchesByCampus,
  getActiveBatches,
};
