import { Router } from 'express';
import {
  getNotifications,
  markAsRead
} from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET /api/notifications - List user's notifications (supports ?unreadOnly=true)
router.get('/', auth, getNotifications);

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', auth, markAsRead);

export default router;
