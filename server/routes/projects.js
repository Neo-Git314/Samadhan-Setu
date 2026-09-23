import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  updateMilestones,
  updateTeam,
  inviteIndustry,
  handleIndustryResponse
} from '../controllers/projectController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// GET /api/projects - List projects (or ?industryPartnerId=me for industry role)
router.get('/', auth, getProjects);

// GET /api/projects/:id - View project details
router.get('/:id', auth, getProjectById);

// PATCH /api/projects/:id/milestones - University updates or adds milestones
router.patch('/:id/milestones', auth, requireRole(['university']), updateMilestones);

// PATCH /api/projects/:id/team - University adds or removes team members
router.patch('/:id/team', auth, requireRole(['university']), updateTeam);

// POST /api/projects/:id/invite-industry - University invites industry partner
router.post('/:id/invite-industry', auth, requireRole(['university']), inviteIndustry);

// PATCH /api/projects/:id/industry-response - Industry partner accepts or declines invitation
router.patch('/:id/industry-response', auth, requireRole(['industry']), handleIndustryResponse);

export default router;
