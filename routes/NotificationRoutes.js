const express = require('express');
const router = express.Router();
const {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationById,
  restoreNotification,
  getActiveNotifications
} = require('../controllers/NotificationController');
const { protectBoth } = require('../middleware/authMiddleware');

router.get('/',protect,  getNotifications);
router.get('/active',protectBoth, getActiveNotifications);
router.post('/',protect, createNotification);
router.get('/:id',protect, getNotificationById);
router.put('/:id',protect, updateNotification);
router.delete('/:id',protect, deleteNotification);
router.put('/restore/:id',protect, restoreNotification);

module.exports = router;
