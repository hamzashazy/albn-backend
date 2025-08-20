const express = require('express');
const {
  createNotification,
  getNotifications
} = require('../controllers/NotificationController');
const { protectBoth,protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/send',protect, createNotification);
router.get('/',protectBoth, getNotifications);
module.exports = router;
