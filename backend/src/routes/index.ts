import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import dashboardRoutes from './dashboardRoutes';
import complaintRoutes from './complaintRoutes';
import maintenanceRoutes from './maintenanceRoutes';
import wardenRoutes from './wardenRoutes';
import adminRoutes from './adminRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/complaints', complaintRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/warden', wardenRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
