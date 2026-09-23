import mongoose from 'mongoose';
import University from '../models/University.js';
import Complaint from '../models/Complaint.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { getEmbedding } from '../services/aiService.js';

/**
 * GET /api/universities
 * List all university profiles
 */
export const getUniversities = async (_req, res, next) => {
  try {
    const universities = await University.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    return res.status(200).json(universities);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/universities
 * Role: admin
 * Creates a university profile with pre-computed researchEmbedding
 */
export const createUniversity = async (req, res, next) => {
  try {
    const {
      name,
      location,
      disciplines,
      researchKeywords,
      incubationFacility,
      contactEmail,
      userId
    } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'University name is required.'
      });
    }

    const parsedKeywords = Array.isArray(researchKeywords)
      ? researchKeywords
      : typeof researchKeywords === 'string'
      ? researchKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    const parsedDisciplines = Array.isArray(disciplines)
      ? disciplines
      : typeof disciplines === 'string'
      ? disciplines.split(',').map((d) => d.trim()).filter(Boolean)
      : [];

    // Pre-compute researchEmbedding from research keywords
    let researchEmbedding = [];
    if (parsedKeywords.length > 0) {
      try {
        researchEmbedding = await getEmbedding(parsedKeywords.join(' '));
      } catch (embErr) {
        console.warn('[createUniversity] Could not generate researchEmbedding:', embErr.message);
      }
    }

    const university = await University.create({
      userId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null,
      name: name.trim(),
      location: location || { lat: null, lng: null },
      disciplines: parsedDisciplines,
      researchKeywords: parsedKeywords,
      researchEmbedding,
      incubationFacility: Boolean(incubationFacility),
      contactEmail: contactEmail ? contactEmail.trim() : ''
    });

    return res.status(201).json(university);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/universities/:id/challenges
 * Role: university
 * Returns complaints where suggestedUniversities contains this university,
 * status != "duplicate", and assignedUniversity == null
 */
export const getUniversityChallenges = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid university ID format.'
      });
    }

    const challenges = await Complaint.find({
      'suggestedUniversities.universityId': id,
      status: { $nin: ['duplicate', 'assigned', 'resolved'] },
      assignedUniversity: null
    })
      .populate('submittedBy', 'name email district')
      .sort({ createdAt: -1 });

    return res.status(200).json(challenges);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/universities/:id/accept/:complaintId
 * Role: university
 * Accepts challenge: complaint.status = "assigned", complaint.assignedUniversity = id,
 * creates Project with status = "proposed", notifies citizen.
 */
export const acceptChallenge = async (req, res, next) => {
  try {
    const { id, complaintId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid university ID or complaint ID format.'
      });
    }

    const [university, complaint] = await Promise.all([
      University.findById(id),
      Complaint.findById(complaintId)
    ]);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found.'
      });
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    if (complaint.status === 'duplicate') {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept a duplicate complaint.'
      });
    }

    // Assign complaint
    complaint.status = 'assigned';
    complaint.assignedUniversity = university._id;
    await complaint.save();

    // Create notification for the submitting citizen
    if (complaint.submittedBy) {
      await Notification.create({
        userId: complaint.submittedBy,
        message: 'Your complaint has been assigned to a university',
        type: 'status_change',
        relatedId: complaint._id
      });
    }

    // Create a new Project document with status "proposed"
    const project = await Project.create({
      complaintId: complaint._id,
      universityId: university._id,
      status: 'proposed',
      team: []
    });

    // Increment university's active projects count (Task 8.1)
    university.activeProjectsCount = (university.activeProjectsCount || 0) + 1;
    await university.save();

    return res.status(200).json({
      success: true,
      message: `Complaint accepted by ${university.name}. Project proposed.`,
      complaint,
      project
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUniversities,
  createUniversity,
  getUniversityChallenges,
  acceptChallenge
};
