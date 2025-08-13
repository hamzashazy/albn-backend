const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdmins, getAdminById, updateAdmin, deleteAdmin, restoreAdmin } 
= require('../controllers/AdminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register',protect, registerAdmin);
router.post('/login', loginAdmin);
router.get('/',protect, getAdmins);
router.get('/:id',protect, getAdminById);
router.put('/:id', protect, updateAdmin);
router.delete('/:id', protect, deleteAdmin);
router.put('/restore/:id', protect, restoreAdmin); 

module.exports = router;
