import { Response } from 'express';
import { db } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getAdminOverview = async (req: AuthRequest, res: Response) => {
  const hostels = await db.hostel.findMany({
    include: {
      blocks: {
        include: {
          rooms: {
            include: {
              beds: {
                include: {
                  student: { include: { user: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const totalUsers = await db.user.count();
  const totalStudents = await db.student.count();
  const totalWardens = await db.warden.count();
  const totalStaff = await db.maintenanceStaff.count();
  const totalRooms = await db.room.count();
  const totalComplaints = await db.complaint.count();

  return sendSuccess(res, 'Admin overview data loaded', {
    hostels,
    counts: {
      totalUsers,
      totalStudents,
      totalWardens,
      totalStaff,
      totalRooms,
      totalComplaints,
    },
  });
};
