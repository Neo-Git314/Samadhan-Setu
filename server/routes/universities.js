import { Router } from 'express';
import {
  acceptChallenge,
  createUniversity,
  getUniversities,
  getUniversityChallenges
} from '../controllers/universityController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// GET /api/universities - List all university profiles (authenticated)
router.get('/', auth, getUniversities);

// POST /api/universities - Admin creates university profile with research embedding
router.post('/', auth, requireRole(['admin']), createUniversity);

// GET /api/universities/:id/challenges - University retrieves matched challenges
router.get('/:id/challenges', auth, requireRole(['university', 'admin']), getUniversityChallenges);

// POST /api/universities/:id/accept/:complaintId - University accepts challenge & proposes project
router.post('/:id/accept/:complaintId', auth, requireRole(['university', 'admin']), acceptChallenge);

export default router;
