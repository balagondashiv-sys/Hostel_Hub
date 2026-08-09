import { Router } from 'express';
import { classify, createComplaint, getComplaints, getComplaintById, updateStatus, rateComplaint } from '../controllers/complaintController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.post('/classify', authenticateToken, classify);
router.post('/', authenticateToken, createComplaint);
router.get('/', authenticateToken, getComplaints);
router.get('/:id', authenticateToken, getComplaintById);
router.patch('/:id/status', authenticateToken, requireRoles(['WARDEN', 'MAINTENANCE', 'ADMIN']), updateStatus);
router.post('/:id/rating', authenticateToken, requireRoles(['STUDENT']), rateComplaint);

export default router;
