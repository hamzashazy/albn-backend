const Notification = require('../models/NotificationModel');

// ✅ Create notification (Super Admin only)
const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notification = new Notification({ title, message });
    await notification.save();

    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get all notifications (Admins will see all)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createNotification,
  getNotifications
};
