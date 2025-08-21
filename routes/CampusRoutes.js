const express = require('express');
const router = express.Router();
const {
  getCampuses,
  createCampus,
  updateCampus,
  deleteCampus,
  getCampusById,
  restoreCampus,
  getActiveCampuses
} = require('../controllers/CampusController');
const { protect, protectBoth } = require('../middleware/authMiddleware');

router.get('/', protect, getCampuses);
router.get('/active',protectBoth, getActiveCampuses);
router.post('/', protect, createCampus);
router.get('/:id',protect, getCampusById);
router.put('/:id', protect, updateCampus);
router.delete('/:id', protect, deleteCampus);
router.put('/restore/:id', protect, restoreCampus);

module.exports = router;
