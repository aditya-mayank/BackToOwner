import Notification from '../models/Notification.model.js';

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    console.error('Error in getMyNotifications controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Ownership check: only the owner can mark their notification as read
    const notif = await Notification.findById(id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    if (notif.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: not your notification.' });
    }

    notif.status = 'read';
    await notif.save();
    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Error in markAsRead controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createInternalNotification = async (userId, title, message, type = 'info', link = null) => {
  try {
    const newNotif = new Notification({ userId, title, message, type, link });
    await newNotif.save();
    return newNotif;
  } catch (err) {
    console.error('[CRITICAL] Failed to create internal notification:', err);
    return null;
  }
};
