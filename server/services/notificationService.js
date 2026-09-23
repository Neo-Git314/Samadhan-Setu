import Notification from '../models/Notification.js';

/**
 * Creates and persists a notification for a user.
 * @param {string|mongoose.Types.ObjectId} userId - Recipient user ID
 * @param {string} message - Notification text message
 * @param {string} type - Notification category (e.g. status_change, duplicate_detected, industry_invite)
 * @param {string|mongoose.Types.ObjectId|null} relatedId - Optional related entity ID (complaint, project, etc.)
 * @returns {Promise<Notification>}
 */
export const notifyUser = async (userId, message, type = 'general', relatedId = null) => {
  try {
    if (!userId || !message) {
      console.warn('[notificationService] Missing userId or message for notification');
      return null;
    }

    const notification = await Notification.create({
      userId,
      message: message.trim(),
      type: type || 'general',
      relatedId: relatedId || null,
      read: false
    });

    console.log(`[notificationService] Notification created for user ${userId}: "${message}"`);
    return notification;
  } catch (error) {
    console.error(`[notificationService] Failed to create notification for ${userId}:`, error.message);
    return null;
  }
};

export default {
  notifyUser
};
