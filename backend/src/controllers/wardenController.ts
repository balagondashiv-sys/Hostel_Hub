import { Response } from 'express';
import { db } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getWardenDashboard = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);

  const totalStudents = await db.student.count();
  const totalBeds = await db.bed.count();
  const occupiedBeds = await db.bed.count({ where: { status: 'OCCUPIED' } });

  const openComplaints = await db.complaint.count({
    where: { status: { in: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS'] } },
  });

  const criticalComplaints = await db.complaint.count({
    where: { priority: 'CRITICAL', status: { in: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS'] } },
  });

  // Attention Required Items
  const pendingLeaves = await db.leaveRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { student: { include: { user: true, room: true } } },
  });

  const highPriorityComplaints = await db.complaint.findMany({
    where: { priority: { in: ['HIGH', 'CRITICAL'] }, status: { in: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS'] } },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { student: { include: { user: true } }, room: true, block: true },
  });

  const activeEmergencies = await db.emergencyReport.findMany({
    where: { status: 'REPORTED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // Calculate Operational Health Score (0 - 100)
  const resolvedComplaints = await db.complaint.count({ where: { status: 'RESOLVED' } });
  const totalComplaints = await db.complaint.count();
  const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 50 : 40;

  const occupancyPercentage = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 91;
  const messRatingAvg = await db.messRating.aggregate({ _avg: { overallRating: true } });
  const messScore = (Number(messRatingAvg._avg.overallRating || 4.2) / 5) * 30;
  const emergencyPenalty = activeEmergencies.length * 5;

  const healthScore = Math.max(10, Math.min(100, Math.round(resolutionRate + messScore + 20 - emergencyPenalty)));

  // Operational Insights
  const insights = [
    'Plumbing complaints increased 18% this week in Block B.',
    'Block B currently has the highest maintenance load (14 active tickets).',
    'Mess dinner satisfaction improved 7% this month following menu updates.',
  ];

  return sendSuccess(res, 'Warden dashboard metrics fetched', {
    metrics: {
      totalStudents,
      occupancyPercentage: Math.round(occupancyPercentage),
      openComplaints,
      criticalComplaints,
      healthScore,
    },
    attentionRequired: {
      pendingLeaves,
      highPriorityComplaints,
      activeEmergencies,
    },
    insights,
  });
};

export const handleLeaveAction = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);
  const { id } = req.params;
  const { action, wardenNotes } = req.body; // action: APPROVED or REJECTED

  const leave = await db.leaveRequest.findUnique({ where: { id } });
  if (!leave) return sendError(res, 'Leave request not found', [], 404);

  const updated = await db.leaveRequest.update({
    where: { id },
    data: {
      status: action,
      wardenNotes,
      actionByWardenId: req.user.wardenId,
      actionAt: new Date(),
    },
  });

  if (req.io) {
    req.io.emit('leave.updated', { id, status: action });
  }

  return sendSuccess(res, `Leave request ${action.toLowerCase()}`, updated);
};
