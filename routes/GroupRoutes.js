const express = require('express');
const router = express.Router();
const {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupById,
  restoreGroup,
  getActiveGroups
} = require('../controllers/GroupController');
const { protectBoth } = require('../middleware/authMiddleware');

router.get('/',protectBoth,  getGroups);
router.get('/active', getActiveGroups);
router.post('/',protectBoth, createGroup);
router.get('/:id',protectBoth, getGroupById);
router.put('/:id',protectBoth, updateGroup);
router.delete('/:id',protectBoth, deleteGroup);
router.put('/restore/:id',protectBoth, restoreGroup);

module.exports = router;
