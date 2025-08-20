const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getStudents,getActiveStudents,getStudentsByCampus, getStudentById, updateStudent, deleteStudent, restoreStudent, registerStudentfromAdmin } 
= require('../controllers/StudentController');
const { protectBoth,protect } = require('../middleware/authMiddleware');

router.post('/register',protectBoth, registerStudent);
router.post('/registersfa',protectBoth, registerStudentfromAdmin);
router.post('/login', loginStudent);
router.get('/',protect,getStudents);
router.get('/active',protect, getActiveStudents);
router.get('/bycampus',protectBoth,getStudentsByCampus);
router.get('/:id',protectBoth, getStudentById);
router.put('/:id',protectBoth, updateStudent);
router.delete('/:id',protectBoth, deleteStudent);
router.put('/restore/:id',protectBoth, restoreStudent); 
module.exports = router;
