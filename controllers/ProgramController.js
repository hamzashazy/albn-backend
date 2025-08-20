const Program = require('../models/ProgramModel');
const Admin = require('../models/AdminModel');

// @desc    Create new program
const createProgram = async (req, res) => {
  try {
    const { title, details, startDate, campus } = req.body;

    if (!title || !details || !startDate || !campus) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const program = await Program.create({ title, details, startDate, campus });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all programs
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 }).populate('campus', 'name');
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgramsByCampus = async (req, res, next) => {
  try {
    const campusId = req.Admin?.campus; // ✅ match middleware

    if (!campusId) {
      return res.status(400).json({ message: 'Campus not assigned to user' });
    }

    const programs = await Program.find({ campus: campusId })
      .populate('campus', 'name')

    res.status(200).json(programs);
  } catch (err) {
    next(err);
  }
};

const createStudentfromAdmin = async (req, res) => {
  try {
    // Find the logged-in admin
    const admin = await Admin.findById(req.Admin._id).select('campus');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Force campus to admin's campus
    req.body.campus = admin.campus;

    const program = await Program.create(req.body);

    res.status(201).json(program);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Get only active programs (isDeleted: false)
const getActivePrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isDeleted: false }).populate('campus', 'name');
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active programs: ' + error.message });
  }
};

// @desc    Get single program by ID
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update program
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Program.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete program
// Delete program
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ message: 'Program marked as deleted successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({ message: 'Program restored successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProgram,
  getPrograms,
  getProgramById, // <- added here
  updateProgram,
  deleteProgram,
  restoreProgram,
  getProgramsByCampus,
  getActivePrograms,
  createStudentfromAdmin,
};
