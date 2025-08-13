const Student = require('../models/StudentModel');
const Admin = require('../models/AdminModel'); // <-- add this at the top
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc   Get all students (excluding passwords)
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().select('-password')
      .populate('campus', 'name') 
      .populate('group', 'name')
      .populate('program', 'title');
;
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

const getStudentsByCampus = async (req, res, next) => {
  try {
    const campusId = req.Admin?.campus; // ✅ match middleware

    if (!campusId) {
      return res.status(400).json({ message: 'Campus not assigned to user' });
    }

    const students = await Student.find({ campus: campusId })
      .select('-password')
      .populate('campus', 'name')
      .populate('group', 'name')
      .populate('program', 'title');

    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

// @desc   Get all active students (not deleted)
const getActiveStudents = async (req, res, next) => {
  try {
    // Optional: Filter by campus if admin campus available (like previous method)
    const filter = { isDeleted: false };

    if (req.user?.campus?._id) {
      filter.campus = req.user.campus._id;
    }

    const students = await Student.find(filter)
      .select('-password')
      .populate('campus', 'name')
      .populate('group', 'name')
      .populate('program', 'title');

    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};


// @desc   Register new student
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, campus, program, group } = req.body;

    // Validate input
    if (!name || !email || !password || !campus || !program || !group) {
      return res.status(400).json({ message: 'Please provide all relevant details' });
    }

    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Create new student
    const student = await Student.create({ name, email, password, campus, program, group });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      campus: student.campus,
      program: student.program,
      group: student.group,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerStudentfromAdmin = async (req, res) => {
  try {
    // Find the logged-in admin
    const admin = await Admin.findById(req.Admin._id).select('campus');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Force campus to admin's campus
    req.body.campus = admin.campus;

    const student = await Student.create(req.body);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Login student
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });

    if (student && (await student.matchPassword(password))) {
      res.json({
        _id: student._id,
        email: student.email,
        name: student.name,
        campus: student.campus,
        program: student.program,
        group: student.group,
        token: generateToken(student._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, email, password, campus, program, group } = req.body;

    if (name) student.name = name;
    if (email) student.email = email;
    if (campus) student.campus = campus;
    if (program) student.program = program;
    if (group) student.group = group;
    if (password) student.password = password;

    const updatedStudent = await student.save();

    res.status(200).json({
      _id: updatedStudent._id,
      name: updatedStudent.name,
      email: updatedStudent.email,
      campus: updatedStudent.campus,
      program: updatedStudent.program,
      group: updatedStudent.group,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student marked as deleted successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student restored successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerStudent,
  loginStudent,
  getStudents,
  getStudentById, // <-- Add this
  updateStudent,
  deleteStudent,
  restoreStudent, // <-- Add this
  getStudentsByCampus,
  getActiveStudents,
  registerStudentfromAdmin, // <-- Add this
};
