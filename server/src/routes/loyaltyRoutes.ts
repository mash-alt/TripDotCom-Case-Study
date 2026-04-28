import { Router } from 'express';
import * as loyaltyController from '../controllers/loyaltyController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/loyalty/:customerId', asyncHandler(loyaltyController.getLoyalty));

export default router;
