const express = require('express');
const { protect, protectBoth } = require('../middleware/authMiddleware');
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
router.post('/', protectBoth, createProgram);
router.get('/', protect, getPrograms);
router.get('/bycampus',protectBoth,getProgramsByCampus);
router.get('/active',protect, getActivePrograms);
router.put('/:id', protectBoth, updateProgram);
router.get('/:id', protectBoth, getProgramById);
router.delete('/:id', protectBoth, deleteProgram);
router.put('/restore/:id', protectBoth, restoreProgram);

module.exports = router;
