import { Router } from 'express';
import { getStudentDashboard } from '../controllers/dashboardController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/student', authenticateToken, requireRoles(['STUDENT', 'ADMIN']), getStudentDashboard);

export default router;
