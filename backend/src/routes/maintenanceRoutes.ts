import { Router } from 'express';
import { getMaintenanceTasks, updateTaskProgress } from '../controllers/maintenanceController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/tasks', authenticateToken, requireRoles(['MAINTENANCE', 'WARDEN', 'ADMIN']), getMaintenanceTasks);
router.patch('/tasks/:id', authenticateToken, requireRoles(['MAINTENANCE', 'ADMIN']), updateTaskProgress);

export default router;
