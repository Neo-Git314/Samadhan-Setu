import { Router } from 'express';
import {
  createComplaint,
  getComplaintById,
  getComplaintDuplicates,
  getComplaints,
  getMyComplaints,
  updateComplaintStatus,
  triageChallenge,
  downloadComplaintPDF
} from '../controllers/complaintController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// POST /api/complaints - Citizen submits challenge with optional image uploads (max 5)
router.post('/', auth, requireRole(['citizen']), upload.array('images', 5), createComplaint);

// GET /api/complaints/my (and /api/grievances/my) - Challenges belonging ONLY to authenticated user
router.get('/my', auth, getMyComplaints);

// GET /api/complaints - List complaints with filters and pagination (Admin/University), or ?submittedBy=me (Citizen)
router.get('/', auth, getComplaints);

// GET /api/complaints/:id/pdf - Public/Citizen PDF download (no strict auth lock needed so print & direct link work)
router.get('/:id/pdf', downloadComplaintPDF);
router.get('/:id/acknowledgement', downloadComplaintPDF);

// GET /api/complaints/:id/duplicates - Fetch duplicate complaints and linked parent
router.get('/:id/duplicates', auth, getComplaintDuplicates);

// GET /api/complaints/:id - View single complaint details (any authenticated user)
router.get('/:id', auth, getComplaintById);

// PATCH /api/complaints/:id/status - Admin updates complaint status
router.patch('/:id/status', auth, requireRole(['admin']), updateComplaintStatus);

// PATCH /api/complaints/:id/triage - Admin updates challenge AI screening classification / validation
router.patch('/:id/triage', auth, requireRole(['admin']), triageChallenge);

export default router;
