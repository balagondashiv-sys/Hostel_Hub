import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting HostelHub Database Seeding...');

  // Reset existing data
  await prisma.auditLog.deleteMany();
  await prisma.emergencyReport.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.messRating.deleteMany();
  await prisma.messMenu.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.maintenanceTask.deleteMany();
  await prisma.complaintUpdate.deleteMany();
  await prisma.complaintAttachment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.roomAllocation.deleteMany();
  await prisma.maintenanceStaff.deleteMany();
  await prisma.wardenHostel.deleteMany();
  await prisma.warden.deleteMany();
  await prisma.student.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.room.deleteMany();
  await prisma.block.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo1234', 10);

  // 1. Create Core Users & Roles
  console.log('👤 Creating Users...');

  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@hostelhub.demo',
      passwordHash,
      name: 'Dr. Vikram Sarabhai',
      phone: '+91 9876543210',
      role: 'ADMIN',
    },
  });

  // Wardens
  const wardenUser1 = await prisma.user.create({
    data: {
      email: 'warden@hostelhub.demo',
      passwordHash,
      name: 'Prof. Rajesh Kumar',
      phone: '+91 9876543211',
      role: 'WARDEN',
    },
  });

  const wardenUser2 = await prisma.user.create({
    data: {
      email: 'warden.blockb@hostelhub.demo',
      passwordHash,
      name: 'Dr. Anita Desai',
      phone: '+91 9876543212',
      role: 'WARDEN',
    },
  });

  // Maintenance Staff
  const plumbStaffUser = await prisma.user.create({
    data: {
      email: 'maintenance@hostelhub.demo',
      passwordHash,
      name: 'Ramesh Plumber',
      phone: '+91 9876543220',
      role: 'MAINTENANCE',
    },
  });

  const elecStaffUser = await prisma.user.create({
    data: {
      email: 'elec.staff@hostelhub.demo',
      passwordHash,
      name: 'Suresh Electrician',
      phone: '+91 9876543221',
      role: 'MAINTENANCE',
    },
  });

  const furnStaffUser = await prisma.user.create({
    data: {
      email: 'carpenter@hostelhub.demo',
      passwordHash,
      name: 'Mahesh Carpenter',
      phone: '+91 9876543222',
      role: 'MAINTENANCE',
    },
  });

  const netStaffUser = await prisma.user.create({
    data: {
      email: 'wifi.staff@hostelhub.demo',
      passwordHash,
      name: 'Vikram IT Admin',
      phone: '+91 9876543223',
      role: 'MAINTENANCE',
    },
  });

  const cleanStaffUser = await prisma.user.create({
    data: {
      email: 'cleaning.staff@hostelhub.demo',
      passwordHash,
      name: 'Prakash Cleaning Head',
      phone: '+91 9876543224',
      role: 'MAINTENANCE',
    },
  });

  // Main Demo Student (Rahul Sharma)
  const studentUserMain = await prisma.user.create({
    data: {
      email: 'student@hostelhub.demo',
      passwordHash,
      name: 'Rahul Sharma',
      phone: '+91 9876543200',
      role: 'STUDENT',
    },
  });

  // 2. Create Hostels, Blocks, Rooms & Beds
  console.log('🏢 Creating Hostels, Blocks & 100+ Rooms...');

  const hostelA = await prisma.hostel.create({
    data: {
      name: 'Aryabhatta Hostel',
      code: 'AB-HOSTEL',
      address: 'North Campus, Tech Boulevard',
      totalBlocks: 3,
    },
  });

  const hostelB = await prisma.hostel.create({
    data: {
      name: 'Bhaskara Hostel',
      code: 'BH-HOSTEL',
      address: 'South Campus, Academic Enclave',
      totalBlocks: 2,
    },
  });

  // Warden Profiles
  const warden1 = await prisma.warden.create({
    data: {
      userId: wardenUser1.id,
      phone: wardenUser1.phone!,
    },
  });

  const warden2 = await prisma.warden.create({
    data: {
      userId: wardenUser2.id,
      phone: wardenUser2.phone!,
    },
  });

  await prisma.wardenHostel.createMany({
    data: [
      { wardenId: warden1.id, hostelId: hostelA.id },
      { wardenId: warden2.id, hostelId: hostelB.id },
    ],
  });

  // Maintenance Staff Profiles
  const plumbStaff = await prisma.maintenanceStaff.create({
    data: { userId: plumbStaffUser.id, category: 'PLUMBING', phone: plumbStaffUser.phone! },
  });
  const elecStaff = await prisma.maintenanceStaff.create({
    data: { userId: elecStaffUser.id, category: 'ELECTRICAL', phone: elecStaffUser.phone! },
  });
  const furnStaff = await prisma.maintenanceStaff.create({
    data: { userId: furnStaffUser.id, category: 'FURNITURE', phone: furnStaffUser.phone! },
  });
  const netStaff = await prisma.maintenanceStaff.create({
    data: { userId: netStaffUser.id, category: 'NETWORK', phone: netStaffUser.phone! },
  });
  const cleanStaff = await prisma.maintenanceStaff.create({
    data: { userId: cleanStaffUser.id, category: 'CLEANING', phone: cleanStaffUser.phone! },
  });

  // Blocks
  const blockA = await prisma.block.create({
    data: { hostelId: hostelA.id, name: 'Block A', floorCount: 3 },
  });

  const blockB = await prisma.block.create({
    data: { hostelId: hostelA.id, name: 'Block B', floorCount: 3 },
  });

  const blockC = await prisma.block.create({
    data: { hostelId: hostelA.id, name: 'Block C', floorCount: 3 },
  });

  // Helper to generate 100+ rooms across 3 blocks
  let allRooms: any[] = [];
  const blocks = [blockA, blockB, blockC];

  for (const blk of blocks) {
    for (let floor = 1; floor <= 3; floor++) {
      for (let roomNum = 1; roomNum <= 12; roomNum++) {
        const paddedNum = roomNum.toString().padStart(2, '0');
        const roomNumber = `${blk.name.split(' ')[1]}-${floor}${paddedNum}`;
        const room = await prisma.room.create({
          data: {
            blockId: blk.id,
            roomNumber,
            floor,
            capacity: 4,
            status: roomNum === 4 && floor === 2 ? 'MAINTENANCE' : 'AVAILABLE',
          },
        });

        // Create 4 beds for each room
        for (let b = 1; b <= 4; b++) {
          await prisma.bed.create({
            data: {
              roomId: room.id,
              bedNumber: b,
              status: roomNum <= 8 ? 'OCCUPIED' : 'AVAILABLE',
            },
          });
        }
        allRooms.push(room);
      }
    }
  }

  // Get Room B-204 bed 2 for main student Rahul
  const roomB204 = await prisma.room.findFirst({ where: { roomNumber: 'B-204' }, include: { beds: true } });
  const bedMain = roomB204?.beds[1] || roomB204?.beds[0];

  // Create Main Student Profile
  const studentMain = await prisma.student.create({
    data: {
      userId: studentUserMain.id,
      rollNumber: 'CS2026-1042',
      department: 'Computer Science',
      batch: '2022-2026',
      hostelId: hostelA.id,
      blockId: blockB.id,
      roomId: roomB204!.id,
      bedId: bedMain!.id,
      emergencyContact: '+91 9988776655',
    },
  });

  // Additional 29 Students
  console.log('🎓 Creating 29 additional students & room allocations...');
  const studentNames = [
    'Aarav Patel', 'Aditya Verma', 'Ananya Iyer', 'Bhavya Joshi', 'Chirag Reddy',
    'Devika Nair', 'Eshaan Gupta', 'Farhan Khan', 'Gautam Sen', 'Harini Rao',
    'Ishan Malhotra', 'Jiya Singh', 'Karan Mehta', 'Kavya Pillai', 'Luv Sharma',
    'Manish Das', 'Neha Kapoor', 'Omkar Kulkarni', 'Pooja Bhat', 'Rohan Saxena',
    'Siddharth Roy', 'Tanya Agarwal', 'Utkarsh Mishra', 'Varun Tripathi', 'Yash Chaudhari',
    'Zoya Siddiqui', 'Akash Pandey', 'Divya Sundaram', 'Nikhil Choudhury'
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const sName = studentNames[i];
    const sEmail = `${sName.toLowerCase().replace(' ', '.')}@hostelhub.demo`;
    const user = await prisma.user.create({
      data: {
        email: sEmail,
        passwordHash,
        name: sName,
        phone: `+91 98765430${(i + 10).toString().padStart(2, '0')}`,
        role: 'STUDENT',
      },
    });

    const targetRoom = allRooms[i % allRooms.length];
    const beds = await prisma.bed.findMany({ where: { roomId: targetRoom.id } });
    const freeBed = beds[i % 4];

    await prisma.student.create({
      data: {
        userId: user.id,
        rollNumber: `EC2026-${2000 + i}`,
        department: i % 2 === 0 ? 'Electronics' : 'Mechanical',
        batch: '2022-2026',
        hostelId: hostelA.id,
        blockId: targetRoom.blockId,
        roomId: targetRoom.id,
        bedId: freeBed.id,
        emergencyContact: `+91 98000000${(i + 10).toString().padStart(2, '0')}`,
      },
    });
  }

  // 3. Create Complaints & Maintenance Work Logs
  console.log('🛠️ Creating realistic Complaints & Worklogs...');

  const complaint1 = await prisma.complaint.create({
    data: {
      ticketNumber: 'TKT-1042',
      studentId: studentMain.id,
      hostelId: hostelA.id,
      blockId: blockB.id,
      roomId: roomB204!.id,
      category: 'ELECTRICAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      title: 'Ceiling Fan making grinding noise',
      description: 'The ceiling fan in Room B-204 is making an extremely loud noise and spinning slowly.',
      locationType: 'Room',
      isAiClassified: true,
      aiConfidence: 0.94,
      assignedToId: elecStaff.id,
      estimatedResolution: 'Within 2 hours',
    },
  });

  await prisma.complaintUpdate.createMany({
    data: [
      {
        complaintId: complaint1.id,
        userId: studentUserMain.id,
        message: 'Reported issue: Ceiling Fan making grinding noise.',
        newStatus: 'REPORTED',
      },
      {
        complaintId: complaint1.id,
        userId: wardenUser1.id,
        message: 'Assigned ticket to Electrical Team (Suresh Electrician).',
        previousStatus: 'REPORTED',
        newStatus: 'ASSIGNED',
      },
      {
        complaintId: complaint1.id,
        userId: elecStaffUser.id,
        message: 'Technician reached room B-204. Replacing fan motor capacitor.',
        previousStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        isWorkNote: true,
      },
    ],
  });

  await prisma.maintenanceTask.create({
    data: {
      complaintId: complaint1.id,
      staffId: elecStaff.id,
      status: 'IN_PROGRESS',
      slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
      workNotes: 'Capacitor replacement underway.',
    },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      ticketNumber: 'TKT-1039',
      studentId: studentMain.id,
      hostelId: hostelA.id,
      blockId: blockB.id,
      roomId: roomB204!.id,
      category: 'PLUMBING',
      priority: 'CRITICAL',
      status: 'RESOLVED',
      title: 'Bathroom tap leakage in B-204',
      description: 'Water tap is leaking continuously and spreading water across the floor.',
      locationType: 'Bathroom',
      isAiClassified: true,
      aiConfidence: 0.98,
      assignedToId: plumbStaff.id,
      estimatedResolution: 'Resolved',
      rating: 5,
      feedback: 'Quick response by Ramesh! Fixed within 45 mins.',
      resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  await prisma.complaintUpdate.createMany({
    data: [
      {
        complaintId: complaint2.id,
        userId: studentUserMain.id,
        message: 'Reported issue: Bathroom tap leakage.',
        newStatus: 'REPORTED',
      },
      {
        complaintId: complaint2.id,
        userId: plumbStaffUser.id,
        message: 'Replaced tap washer and sealed thread leakage.',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        isWorkNote: true,
      },
    ],
  });

  // 4. Leave Requests
  console.log('📝 Creating Leave Requests...');

  await prisma.leaveRequest.create({
    data: {
      studentId: studentMain.id,
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-17'),
      leaveType: 'HOME',
      reason: 'Independence Day weekend home visit',
      destination: 'Jaipur, Rajasthan',
      emergencyPhone: '+91 9988776655',
      status: 'APPROVED',
      wardenNotes: 'Approved. Ensure return before 8:00 PM on Aug 17.',
      actionByWardenId: warden1.id,
      actionAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  });

  await prisma.leaveRequest.create({
    data: {
      studentId: studentMain.id,
      startDate: new Date('2026-08-25'),
      endDate: new Date('2026-08-27'),
      leaveType: 'ACADEMIC',
      reason: 'Attending Inter-College Tech Symposium',
      destination: 'IIT Delhi',
      emergencyPhone: '+91 9988776655',
      status: 'PENDING',
    },
  });

  // 5. Mess Menu & Ratings
  console.log('🍛 Creating Mess Menus & Ratings...');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const day of days) {
    await prisma.messMenu.create({
      data: {
        hostelId: hostelA.id,
        dayOfWeek: day,
        mealType: 'BREAKFAST',
        items: JSON.stringify(['Idly', 'Sambar', 'Coconut Chutney', 'Tea / Coffee']),
        timings: '07:30 AM - 09:30 AM',
      },
    });
    await prisma.messMenu.create({
      data: {
        hostelId: hostelA.id,
        dayOfWeek: day,
        mealType: 'LUNCH',
        items: JSON.stringify(['Jeera Rice', 'Dal Tadka', 'Aloo Gobi', 'Chapati', 'Curd']),
        timings: '12:30 PM - 02:30 PM',
      },
    });
    await prisma.messMenu.create({
      data: {
        hostelId: hostelA.id,
        dayOfWeek: day,
        mealType: 'DINNER',
        items: JSON.stringify(['Butter Chapati', 'Paneer Butter Masala', 'Dal Makhani', 'Steamed Rice', 'Gulab Jamun']),
        timings: '07:30 PM - 09:30 PM',
      },
    });
  }

  await prisma.messRating.create({
    data: {
      studentId: studentMain.id,
      hostelId: hostelA.id,
      mealType: 'DINNER',
      tasteRating: 5,
      qualityRating: 4,
      quantityRating: 4,
      overallRating: 4.3,
      comment: 'Paneer was fresh and chapati was hot!',
    },
  });

  // 6. Notices & Emergency Reports
  console.log('📢 Creating Notices & Emergency Reports...');

  await prisma.notice.create({
    data: {
      title: 'Water Supply Maintenance - Block B',
      content: 'Scheduled plumbing pipeline maintenance in Block B tomorrow from 10:00 AM to 1:00 PM. Please store sufficient water.',
      type: 'MAINTENANCE',
      hostelId: hostelA.id,
      isEmergency: true,
      authorId: wardenUser1.id,
    },
  });

  await prisma.notice.create({
    data: {
      title: 'Hostel Cultural Fest Registration',
      content: 'Registrations are open for the annual Hostel Night music & drama competitions. Contact Block Reps.',
      type: 'EVENT',
      hostelId: hostelA.id,
      isEmergency: false,
      authorId: wardenUser1.id,
    },
  });

  // 7. Fees & Attendance
  console.log('💳 Creating Fee Records & Attendance...');

  await prisma.fee.create({
    data: {
      studentId: studentMain.id,
      title: 'Odd Semester Hostel & Mess Charges 2026',
      amount: 45000,
      dueDate: new Date('2026-09-10'),
      status: 'PENDING',
      category: 'HOSTEL_FEE',
    },
  });

  await prisma.attendance.create({
    data: {
      studentId: studentMain.id,
      date: new Date(),
      status: 'PRESENT',
      markedBy: wardenUser1.id,
    },
  });

  // 8. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUserMain.id,
        title: 'Complaint #TKT-1042 In Progress',
        message: 'Suresh Electrician has accepted your ticket and reached Room B-204.',
        type: 'COMPLAINT',
        link: '/dashboard/student/complaints',
      },
      {
        userId: studentUserMain.id,
        title: 'Leave Request Approved',
        message: 'Your leave application for Aug 15–17 has been approved by Warden.',
        type: 'LEAVE',
        link: '/dashboard/student/leave',
      },
    ],
  });

  console.log('✅ HostelHub Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
