import { Router } from 'express';
import { getWardenDashboard, handleLeaveAction } from '../controllers/wardenController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, requireRoles(['WARDEN', 'ADMIN']), getWardenDashboard);
router.patch('/leave/:id', authenticateToken, requireRoles(['WARDEN', 'ADMIN']), handleLeaveAction);

export default router;
