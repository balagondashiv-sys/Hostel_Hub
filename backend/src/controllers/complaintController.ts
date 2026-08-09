import { Response } from 'express';
import { db } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { classifyComplaint } from '../services/aiService';

export const classify = async (req: AuthRequest, res: Response) => {
  const { description } = req.body;
  if (!description || typeof description !== 'string') {
    return sendError(res, 'Description text is required for AI classification', [], 400);
  }

  const result = await classifyComplaint(description);
  return sendSuccess(res, 'AI classification complete', result);
};

export const createComplaint = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);

  const { title, description, category, priority, locationType, photoUrl } = req.body;

  if (!description || !title) {
    return sendError(res, 'Title and description are required', [], 400);
  }

  const student = await db.student.findUnique({
    where: { userId: req.user.id },
  });

  if (!student || !student.hostelId || !student.blockId || !student.roomId) {
    return sendError(res, 'Student room allocation not found', [], 400);
  }

  // Automatic classification fallback if category not passed
  let classificationResult = null;
  if (!category || !priority) {
    classificationResult = await classifyComplaint(description);
  }

  const selectedCategory = category || classificationResult?.category || 'OTHER';
  const selectedPriority = priority || classificationResult?.priority || 'MEDIUM';

  const ticketCount = await db.complaint.count();
  const ticketNumber = `TKT-${1043 + ticketCount}`;

  // Find available maintenance staff matching category
  const matchingStaff = await db.maintenanceStaff.findFirst({
    where: { category: selectedCategory, isAvailable: true },
  });

  const complaint = await db.complaint.create({
    data: {
      ticketNumber,
      studentId: student.id,
      hostelId: student.hostelId,
      blockId: student.blockId,
      roomId: student.roomId,
      title,
      description,
      category: selectedCategory,
      priority: selectedPriority,
      status: matchingStaff ? 'ASSIGNED' : 'REPORTED',
      locationType: locationType || 'Room',
      isAiClassified: true,
      aiConfidence: classificationResult?.confidence || 0.92,
      assignedToId: matchingStaff?.id || null,
      estimatedResolution: classificationResult?.estimatedResolutionTime || 'Within 4 hours',
    },
    include: {
      student: { include: { user: true } },
      assignedTo: { include: { user: true } },
      room: true,
      block: true,
    },
  });

  // Attach photo if provided
  if (photoUrl) {
    await db.complaintAttachment.create({
      data: {
        complaintId: complaint.id,
        fileUrl: photoUrl,
        fileType: 'IMAGE',
      },
    });
  }

  // Initial audit update
  await db.complaintUpdate.create({
    data: {
      complaintId: complaint.id,
      userId: req.user.id,
      message: `Complaint submitted: ${title}`,
      newStatus: complaint.status,
    },
  });

  // If assigned, create maintenance task
  if (matchingStaff) {
    await db.maintenanceTask.create({
      data: {
        complaintId: complaint.id,
        staffId: matchingStaff.id,
        status: 'ASSIGNED',
        slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
      },
    });
  }

  // Broadcast WebSocket event
  if (req.io) {
    req.io.emit('complaint.created', {
      id: complaint.id,
      ticketNumber: complaint.ticketNumber,
      title: complaint.title,
      category: complaint.category,
      priority: complaint.priority,
    });
  }

  return sendSuccess(res, 'Complaint submitted successfully', complaint, 201);
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);

  let whereClause: any = {};

  if (req.user.role === 'STUDENT') {
    whereClause.studentId = req.user.studentId;
  } else if (req.user.role === 'MAINTENANCE') {
    whereClause.assignedToId = req.user.staffId;
  } else if (req.user.role === 'WARDEN' && req.user.hostelId) {
    whereClause.hostelId = req.user.hostelId;
  }

  const complaints = await db.complaint.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      student: { include: { user: true } },
      assignedTo: { include: { user: true } },
      room: true,
      block: true,
      attachments: true,
      updates: { include: { user: true }, orderBy: { createdAt: 'asc' } },
    },
  });

  return sendSuccess(res, 'Complaints retrieved', complaints);
};

export const getComplaintById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const complaint = await db.complaint.findUnique({
    where: { id },
    include: {
      student: { include: { user: true } },
      assignedTo: { include: { user: true } },
      room: true,
      block: true,
      attachments: true,
      tasks: { include: { staff: { include: { user: true } } } },
      updates: { include: { user: true }, orderBy: { createdAt: 'asc' } },
    },
  });

  if (!complaint) return sendError(res, 'Complaint ticket not found', [], 404);

  return sendSuccess(res, 'Complaint details retrieved', complaint);
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);
  const { id } = req.params;
  const { status, workNotes, assignedToId } = req.body;

  const complaint = await db.complaint.findUnique({ where: { id } });
  if (!complaint) return sendError(res, 'Complaint ticket not found', [], 404);

  const updated = await db.complaint.update({
    where: { id },
    data: {
      status: status || complaint.status,
      assignedToId: assignedToId || complaint.assignedToId,
      resolvedAt: status === 'RESOLVED' ? new Date() : complaint.resolvedAt,
    },
  });

  await db.complaintUpdate.create({
    data: {
      complaintId: id,
      userId: req.user.id,
      message: workNotes || `Status changed from ${complaint.status} to ${status}`,
      previousStatus: complaint.status,
      newStatus: status,
      isWorkNote: !!workNotes,
    },
  });

  if (req.io) {
    req.io.emit('complaint.updated', { id, status, updatedBy: req.user.name });
  }

  return sendSuccess(res, 'Complaint status updated', updated);
};

export const rateComplaint = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return sendError(res, 'Valid rating between 1 and 5 is required', [], 400);
  }

  const updated = await db.complaint.update({
    where: { id },
    data: { rating, feedback },
  });

  return sendSuccess(res, 'Thank you for your rating!', updated);
};
