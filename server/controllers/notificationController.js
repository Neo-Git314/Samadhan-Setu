import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

/**
 * GET /api/notifications
 * Returns current user's notifications sorted by createdAt desc
 * Supports ?unreadOnly=true
 */
export const getNotifications = async (req, res, next) => {
  try {
    const filter = { userId: req.user.id };

    if (req.query.unreadOnly === 'true') {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marks notification as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format.'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    return res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getNotifications,
  markAsRead
};
