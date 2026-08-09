# HostelHub — Database Schema & Data Dictionary

## Overview

HostelHub uses PostgreSQL managed through Prisma ORM. The relational model enforces strict foreign key constraints, UUID primary keys, and indexed role/status fields for optimal query performance.

## Key Models

### 1. `User`
- **Fields**: `id`, `email`, `passwordHash`, `name`, `phone`, `role` (`STUDENT`, `WARDEN`, `MAINTENANCE`, `ADMIN`)
- **Indexes**: `[email, role]`

### 2. `Hostel`, `Block`, `Room`, `Bed`
- Hierarchical location model representing campus infrastructure.
- `Room` has `capacity`, `floor`, and `status` (`AVAILABLE`, `FULL`, `MAINTENANCE`).
- `Bed` tracks occupant status (`OCCUPIED`, `AVAILABLE`, `MAINTENANCE`).

### 3. `Student`, `Warden`, `MaintenanceStaff`
- Role-specific profiles linked 1:1 with `User`.
- `Student` holds room & bed allocations, department, roll number.
- `MaintenanceStaff` tracks technical specialty (`PLUMBING`, `ELECTRICAL`, `FURNITURE`, `CLEANING`, `NETWORK`, `CIVIL`, `OTHER`).

### 4. `Complaint`, `ComplaintUpdate`, `MaintenanceTask`
- `Complaint` tracks `ticketNumber`, NLP/AI classification metadata, priority, status, attachments, student ratings.
- `ComplaintUpdate` maintains audit history and work notes.
- `MaintenanceTask` handles SLA deadlines and staff assignment.

### 5. `LeaveRequest`
- Out-of-campus approvals with date ranges, leave type, emergency phone numbers, and Warden action timestamps.

### 6. `MessMenu` & `MessRating`
- Daily/Weekly meal items (Breakfast, Lunch, Snacks, Dinner) and student rating breakdowns (Taste, Quality, Quantity, Overall).

### 7. `Notice`, `Attendance`, `Fee`, `EmergencyReport`
- Broadcast notices with emergency visual callouts, daily attendance logs, student hostel fee billing, and red-alert emergency incidents.
