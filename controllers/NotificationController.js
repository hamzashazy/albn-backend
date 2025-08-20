const Notification = require('../models/NotificationModel');

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications: ' + error.message });
  }
};

// Get only active notifications (isDeleted: false)
const getActiveNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isDeleted: false });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active notifications: ' + error.message });
  }
};


// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification: ' + error.message });
  }
};

// Create new notification
const createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const notificationExists = await Notification.findOne({ title });
    if (notificationExists) {
      return res.status(400).json({ message: 'Notification already exists' });
    }

    const newNotification = await Notification.create({ title, message });
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification: ' + error.message });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const notificationId = req.params.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (title && title !== notification.title) {
      const existingNotification = await Notification.findOne({ title });
      if (existingNotification) {
        return res.status(400).json({ message: 'Notification title already exists' });
      }
    }

    notification.title = title || notification.title;
    notification.message = message || notification.message;

    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification: ' + error.message });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { returnDocument: 'after' } 
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as deleted successfully', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const restoreNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true } // to get updated doc back
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification restored successfully', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  restoreNotification,
  getActiveNotifications, // <-- Add this
};
