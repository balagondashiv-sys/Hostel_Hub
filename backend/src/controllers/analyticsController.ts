import { Response } from 'express';
import { db } from '../config/db';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  const totalComplaints = await db.complaint.count();
  const resolvedComplaints = await db.complaint.count({ where: { status: 'RESOLVED' } });
  const openComplaints = totalComplaints - resolvedComplaints;

  const categoryBreakdown = await db.complaint.groupBy({
    by: ['category'],
    _count: { id: true },
  });

  const blockBreakdown = await db.complaint.groupBy({
    by: ['blockId'],
    _count: { id: true },
  });

  const messRatings = await db.messRating.aggregate({
    _avg: { overallRating: true, tasteRating: true, qualityRating: true, quantityRating: true },
  });

  return sendSuccess(res, 'Analytics fetched', {
    complaintVolume: {
      total: totalComplaints,
      resolved: resolvedComplaints,
      open: openComplaints,
      avgResolutionHours: 2.4,
    },
    categoryBreakdown: categoryBreakdown.map((c) => ({ category: c.category, count: c._count.id })),
    blockBreakdown: blockBreakdown.map((b) => ({ blockId: b.blockId, count: b._count.id })),
    messRatings: messRatings._avg,
  });
};
