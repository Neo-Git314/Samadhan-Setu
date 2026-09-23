import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Complaint from '../models/Complaint.js';
import University from '../models/University.js';
import IndustryPartner from '../models/IndustryPartner.js';
import User from '../models/User.js';
import { notifyUser } from '../services/notificationService.js';
import { sendMail } from '../services/emailService.js';

/**
 * GET /api/projects
 * If ?industryPartnerId=me, returns projects linked to current user's IndustryPartner
 * Otherwise returns projects for university/admin
 */
export const getProjects = async (req, res, next) => {
  try {
    const isIndustryMe = req.query.industryPartnerId === 'me';

    if (isIndustryMe) {
      // Find linked IndustryPartner profile for current user
      const partner = await IndustryPartner.findOne({ userId: req.user.id });
      if (!partner) {
        return res.status(200).json([]);
      }

      const projects = await Project.find({ industryPartnerId: partner._id })
        .populate('complaintId')
        .populate('universityId')
        .populate('industryPartnerId')
        .sort({ createdAt: -1 });

      return res.status(200).json(projects);
    }

    // Otherwise list projects by role
    let filter = {};
    if (req.user.role === 'university') {
      const university = await University.findOne({ userId: req.user.id });
      if (university) {
        filter.universityId = university._id;
      }
    } else if (req.query.universityId) {
      if (mongoose.Types.ObjectId.isValid(req.query.universityId)) {
        filter.universityId = req.query.universityId;
      }
    }

    const projects = await Project.find(filter)
      .populate('complaintId')
      .populate('universityId')
      .populate('industryPartnerId')
      .sort({ createdAt: -1 });

    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id
 * Fetch project details populated with complaint, university, and industry partner
 */
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.'
      });
    }

    const project = await Project.findById(id)
      .populate('complaintId')
      .populate('universityId')
      .populate('industryPartnerId');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projects/:id/milestones
 * Role: university
 * Body: { action: "add" | "update", milestone, milestoneId }
 * If all milestones done -> project.status = "completed" and citizen notified
 */
export const updateMilestones = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, milestone, milestoneId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    if (action === 'add') {
      if (!milestone || !milestone.title) {
        return res.status(400).json({
          success: false,
          message: 'Milestone title is required for action "add".'
        });
      }

      project.milestones.push({
        title: milestone.title.trim(),
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
        status: milestone.status === 'done' ? 'done' : 'pending'
      });
    } else if (action === 'update') {
      const targetId = milestoneId || milestone?._id;
      if (!targetId) {
        return res.status(400).json({
          success: false,
          message: 'milestoneId is required for action "update".'
        });
      }

      const mIndex = project.milestones.findIndex(
        (m) => m._id.toString() === targetId.toString()
      );

      if (mIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Milestone not found in this project.'
        });
      }

      if (milestone.title) project.milestones[mIndex].title = milestone.title.trim();
      if (milestone.dueDate !== undefined)
        project.milestones[mIndex].dueDate = milestone.dueDate ? new Date(milestone.dueDate) : null;
      if (milestone.status) project.milestones[mIndex].status = milestone.status;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "add" or "update".'
      });
    }

    // Check if all milestones are done
    const allDone =
      project.milestones.length > 0 &&
      project.milestones.every((m) => m.status === 'done');

    if (allDone) {
      project.status = 'completed';

      // Idempotent University Reputation Awarding (Task 8.1)
      if (!project.reputationAwarded) {
        const university = await University.findById(project.universityId);
        if (university) {
          university.reputationScore = (university.reputationScore || 0) + 10;
          university.completedProjectsCount = (university.completedProjectsCount || 0) + 1;
          university.activeProjectsCount = Math.max(0, (university.activeProjectsCount || 1) - 1);
          await university.save();

          if (university.userId) {
            await notifyUser(
              university.userId,
              `Congratulations! All milestones completed. 10 reputation points awarded to ${university.name}.`,
              'reputation_awarded',
              project._id
            );
          }
        }
        project.reputationAwarded = true;
      }

      // Update linked complaint to resolved
      const complaint = await Complaint.findById(project.complaintId);
      if (complaint) {
        complaint.status = 'resolved';
        await complaint.save();

        if (complaint.submittedBy) {
          await notifyUser(
            complaint.submittedBy,
            'Your complaint has been resolved through the completed university project!',
            'status_change',
            complaint._id
          );
        }
      }
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Milestones updated successfully.',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projects/:id/team
 * Role: university
 * Body: { action: "add" | "remove", member, memberId }
 */
export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, member, memberId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    if (action === 'add') {
      if (!member || !member.name) {
        return res.status(400).json({
          success: false,
          message: 'Member name is required for action "add".'
        });
      }

      project.team.push({
        name: member.name.trim(),
        role: member.role === 'faculty_mentor' ? 'faculty_mentor' : 'student'
      });
    } else if (action === 'remove') {
      const targetId = memberId || member?._id;
      if (targetId) {
        project.team = project.team.filter((m) => m._id.toString() !== targetId.toString());
      } else if (member && member.name) {
        project.team = project.team.filter((m) => m.name !== member.name.trim());
      } else {
        return res.status(400).json({
          success: false,
          message: 'memberId or member.name required for action "remove".'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "add" or "remove".'
      });
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Team updated successfully.',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects/:id/invite-industry
 * Role: university
 * Body: { industryPartnerId }
 */
export const inviteIndustry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { industryPartnerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(industryPartnerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID or industryPartnerId format.'
      });
    }

    const [project, partner] = await Promise.all([
      Project.findById(id),
      IndustryPartner.findById(industryPartnerId)
    ]);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Industry partner not found.'
      });
    }

    project.industryPartnerId = partner._id;
    await project.save();

    // Create in-app notification for the industry user
    await notifyUser(
      partner.userId,
      "You've been invited to a project",
      'industry_invite',
      project._id
    );

    // Send email invitation
    let recipientEmail = partner.contactEmail;
    if (!recipientEmail && partner.userId) {
      const user = await User.findById(partner.userId);
      recipientEmail = user?.email;
    }

    if (recipientEmail) {
      await sendMail({
        to: recipientEmail,
        subject: "You've been invited to a project",
        text: `Hello ${partner.name},\n\nYou have been invited by a university to collaborate on civic project ID: ${project._id}.\n\nPlease log in to review and respond to the invitation.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Industry partner invited successfully.',
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projects/:id/industry-response
 * Role: industry
 * Body: { accepted: Boolean }
 */
export const handleIndustryResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accepted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID format.'
      });
    }

    if (typeof accepted !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Field "accepted" must be a boolean.'
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    const university = await University.findById(project.universityId);

    if (accepted) {
      project.status = 'approved';
      await project.save();

      // Notify university
      if (university && university.userId) {
        await notifyUser(
          university.userId,
          'Industry partner accepted the project invitation.',
          'industry_response',
          project._id
        );
      }
    } else {
      project.industryPartnerId = null;
      await project.save();

      // Notify university
      if (university && university.userId) {
        await notifyUser(
          university.userId,
          'Industry partner declined the project invitation.',
          'industry_response',
          project._id
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: accepted ? 'Project approved.' : 'Invitation declined.',
      project
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProjects,
  getProjectById,
  updateMilestones,
  updateTeam,
  inviteIndustry,
  handleIndustryResponse
};
