import { Router } from 'express';
import authRoutes from './authRoutes.js';
import customerRoutes from './customerRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import roomRoutes from './roomRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import refundRoutes from './refundRoutes.js';
import supportRoutes from './supportRoutes.js';
import loyaltyRoutes from './loyaltyRoutes.js';

const router = Router();

router.use(hotelRoutes);
router.use(roomRoutes);
router.use(authRoutes);
router.use(customerRoutes);
router.use(bookingRoutes);
router.use(paymentRoutes);
router.use(refundRoutes);
router.use(supportRoutes);
router.use(loyaltyRoutes);

export default router;
