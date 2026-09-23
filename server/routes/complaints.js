import { Router } from 'express';
import {
  createComplaint,
  getComplaintById,
  getComplaintDuplicates,
  getComplaints,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// POST /api/complaints - Citizen submits complaint with optional image uploads (max 5)
router.post('/', auth, requireRole(['citizen']), upload.array('images', 5), createComplaint);

// GET /api/complaints - List complaints with filters and pagination (Admin/University), or ?submittedBy=me (Citizen)
router.get('/', auth, getComplaints);

// GET /api/complaints/:id/duplicates - Fetch duplicate complaints and linked parent
router.get('/:id/duplicates', auth, getComplaintDuplicates);

// GET /api/complaints/:id - View single complaint details (any authenticated user)
router.get('/:id', auth, getComplaintById);

// PATCH /api/complaints/:id/status - Admin updates complaint status
router.patch('/:id/status', auth, requireRole(['admin']), updateComplaintStatus);

export default router;
