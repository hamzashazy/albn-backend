const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  restoreProgram,
  getActivePrograms,
  getProgramsByCampus
} = require('../controllers/ProgramController');

// All routes are protected
router.post('/', protect, createProgram);
router.get('/', protect, getPrograms);
router.get('/active', getActivePrograms);
router.put('/:id', protect, updateProgram);
router.get('/:id', protect, getProgramById);
router.get('/bycampus',protectBoth,getProgrmasByCampus);
router.delete('/:id', protect, deleteProgram);
router.put('/restore/:id', protect, restoreProgram);

module.exports = router;
