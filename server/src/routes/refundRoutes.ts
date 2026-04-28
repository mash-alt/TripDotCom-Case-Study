import { Router } from 'express';
import { body } from 'express-validator';
import * as refundController from '../controllers/refundController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.post(
  '/refunds',
  [body('bookingId').isInt({ min: 1 }), body('reason').optional().isString(), validateRequest],
  asyncHandler(refundController.createRefund),
);
router.get('/refunds', asyncHandler(refundController.listRefunds));
router.delete('/refunds/:id', asyncHandler(refundController.deleteRefund));

export default router;
