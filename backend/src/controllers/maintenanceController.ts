import { Response } from 'express';
import { db } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getMaintenanceTasks = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);

  const staff = await db.maintenanceStaff.findUnique({
    where: { userId: req.user.id },
  });

  const tasks = await db.maintenanceTask.findMany({
    where: staff ? { staffId: staff.id } : undefined,
    orderBy: { slaDeadline: 'asc' },
    include: {
      complaint: {
        include: {
          student: { include: { user: true } },
          room: true,
          block: true,
          attachments: true,
          updates: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        },
      },
    },
  });

  const completedTodayCount = await db.maintenanceTask.count({
    where: {
      status: 'RESOLVED',
      completedAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  return sendSuccess(res, 'Maintenance tasks retrieved', {
    tasks,
    completedTodayCount,
  });
};

export const updateTaskProgress = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);
  const { id } = req.params;
  const { status, workNote } = req.body;

  const task = await db.maintenanceTask.findUnique({
    where: { id },
    include: { complaint: true },
  });

  if (!task) return sendError(res, 'Maintenance task not found', [], 404);

  const isResolved = status === 'RESOLVED';

  const updatedTask = await db.maintenanceTask.update({
    where: { id },
    data: {
      status,
      startedAt: status === 'IN_PROGRESS' && !task.startedAt ? new Date() : task.startedAt,
      completedAt: isResolved ? new Date() : task.completedAt,
      workNotes: workNote ? `${task.workNotes || ''}\n${new Date().toLocaleTimeString()}: ${workNote}` : task.workNotes,
    },
  });

  // Also update parent complaint status
  await db.complaint.update({
    where: { id: task.complaintId },
    data: {
      status: isResolved ? 'RESOLVED' : status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'ASSIGNED',
      resolvedAt: isResolved ? new Date() : undefined,
    },
  });

  // Audit Log Entry
  await db.complaintUpdate.create({
    data: {
      complaintId: task.complaintId,
      userId: req.user.id,
      message: workNote || `Task status updated to ${status}`,
      newStatus: isResolved ? 'RESOLVED' : status,
      isWorkNote: true,
    },
  });

  if (req.io) {
    req.io.emit('complaint.updated', { id: task.complaintId, status });
  }

  return sendSuccess(res, 'Task progress updated', updatedTask);
};
