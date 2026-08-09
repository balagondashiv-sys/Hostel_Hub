import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateToken, requireRoles(['WARDEN', 'ADMIN']), getAnalytics);

export default router;
