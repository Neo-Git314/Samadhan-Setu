import mongoose from 'mongoose';
import IndustryPartner from '../models/IndustryPartner.js';

/**
 * GET /api/industry-partners (or /api/industry)
 * List all industry partners
 */
export const getIndustryPartners = async (_req, res, next) => {
  try {
    const partners = await IndustryPartner.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(partners);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/industry-partners
 * Role: admin
 * Create an industry partner profile
 */
export const createIndustryPartner = async (req, res, next) => {
  try {
    const { userId, name, type, sectorFocus, contactEmail } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Industry partner name is required.'
      });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid userId is required.'
      });
    }

    const parsedSector = Array.isArray(sectorFocus)
      ? sectorFocus
      : typeof sectorFocus === 'string'
      ? sectorFocus.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const partner = await IndustryPartner.create({
      userId,
      name: name.trim(),
      type: ['startup', 'MSME', 'CSR', 'research_lab'].includes(type) ? type : 'startup',
      sectorFocus: parsedSector,
      contactEmail: contactEmail ? contactEmail.trim() : ''
    });

    return res.status(201).json(partner);
  } catch (error) {
    next(error);
  }
};

export default {
  getIndustryPartners,
  createIndustryPartner
};
