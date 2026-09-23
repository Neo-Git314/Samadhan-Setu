import { Router } from 'express';
import { getSummary, getTrends, getHotspots, getPublicSummary } from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// GET /api/analytics/public-summary - Public unauthenticated platform metrics for landing page
router.get('/public-summary', getPublicSummary);

// GET /api/analytics/summary - Admin aggregation summary
router.get('/summary', auth, requireRole(['admin']), getSummary);

// GET /api/analytics/trends - Admin 30-day time-series trends
router.get('/trends', auth, requireRole(['admin']), getTrends);

// GET /api/analytics/hotspots - Geospatial smart-clustering results (Task 7.1)
router.get('/hotspots', auth, getHotspots);

export default router;
