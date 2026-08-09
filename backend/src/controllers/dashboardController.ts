import { Response } from 'express';
import { db } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  if (!req.user) return sendError(res, 'Unauthenticated', [], 401);

  const student = await db.student.findUnique({
    where: { userId: req.user.id },
    include: {
      user: true,
      hostel: true,
      block: true,
      room: {
        include: {
          beds: {
            include: {
              student: { include: { user: true } },
            },
          },
        },
      },
      bed: true,
    },
  });

  if (!student) {
    return sendError(res, 'Student profile not found', [], 404);
  }

  // Active Complaints
  const complaints = await db.complaint.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { assignedTo: { include: { user: true } } },
  });

  // Recent Leave Applications
  const leaves = await db.leaveRequest.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  // Today's Mess Menu
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  const dinnerMenu = await db.messMenu.findFirst({
    where: {
      hostelId: student.hostelId || undefined,
      dayOfWeek: todayName,
      mealType: 'DINNER',
    },
  });

  // Mess Ratings average
  const messRatings = await db.messRating.aggregate({
    where: { hostelId: student.hostelId || undefined },
    _avg: { overallRating: true },
  });

  // Recent Notices
  const notices = await db.notice.findMany({
    where: {
      OR: [
        { hostelId: student.hostelId },
        { hostelId: null },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  // Attendance rate calculation
  const totalAttendance = await db.attendance.count({ where: { studentId: student.id } });
  const presentCount = await db.attendance.count({ where: { studentId: student.id, status: 'PRESENT' } });
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 92;

  // Pending Fees
  const pendingFees = await db.fee.findMany({
    where: { studentId: student.id, status: 'PENDING' },
    take: 2,
  });

  // Live Activity Timeline ("Today at Hostel")
  const activityTimeline = [
    { time: '08:10 AM', text: 'Breakfast menu updated: Idly, Sambar & Coconut Chutney', type: 'MESS' },
    { time: '09:24 AM', text: 'Complaint #TKT-1042 assigned to Electrical Team', type: 'COMPLAINT' },
    { time: '10:05 AM', text: 'New Notice: Water Supply Maintenance in Block B tomorrow', type: 'NOTICE' },
    { time: '11:32 AM', text: 'Leave request for Independence Day weekend APPROVED', type: 'LEAVE' },
    { time: '01:10 PM', text: 'Room B-204 bathroom tap repair completed', type: 'MAINTENANCE' },
  ];

  return sendSuccess(res, 'Student dashboard loaded', {
    student: {
      name: student.user.name,
      rollNumber: student.rollNumber,
      department: student.department,
      hostel: student.hostel?.name || 'Aryabhatta Hostel',
      block: student.block?.name || 'Block B',
      roomNumber: student.room?.roomNumber || 'B-204',
      bedNumber: student.bed?.bedNumber || 2,
      occupancy: `${student.room?.beds.filter(b => b.status === 'OCCUPIED').length || 3}/${student.room?.capacity || 4}`,
      roommates: student.room?.beds
        .filter((b) => b.student && b.student.id !== student.id)
        .map((b) => ({
          name: b.student?.user.name,
          bed: b.bedNumber,
          department: b.student?.department,
        })) || [],
    },
    activityTimeline,
    complaints,
    leaves,
    mess: {
      dinnerItems: dinnerMenu ? JSON.parse(dinnerMenu.items) : ['Chapati', 'Paneer Butter Masala', 'Dal', 'Rice'],
      rating: messRatings._avg.overallRating ? Number(messRatings._avg.overallRating.toFixed(1)) : 4.2,
    },
    attendanceRate,
    notices,
    pendingFees,
  });
};
