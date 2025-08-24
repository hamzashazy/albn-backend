const express = require('express');
const { protect, protectBoth } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  restoreBatch,
  getActiveBatches,
  getBatchesByCampus,
} = require('../controllers/BatchController');

// All routes are protected
router.post('/', protectBoth, createBatch);
router.get('/', protect, getBatches);
router.get('/bycampus',protectBoth,getBatchesByCampus);
router.get('/active',protectBoth, getActiveBatches);
router.put('/:id', protectBoth, updateBatch);
router.get('/:id', protectBoth, getBatchById);
router.delete('/:id', protectBoth, deleteBatch);
router.put('/restore/:id', protectBoth, restoreBatch);

module.exports = router;
