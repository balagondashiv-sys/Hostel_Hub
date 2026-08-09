import { Router } from 'express';
import { getAdminOverview } from '../controllers/adminController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/overview', authenticateToken, requireRoles(['ADMIN']), getAdminOverview);

export default router;
