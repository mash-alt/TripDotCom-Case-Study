import { Router } from 'express';
import { body } from 'express-validator';
import * as paymentController from '../controllers/paymentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.post(
  '/payments',
  requireRole(['customer']),
  [
    body('bookingId').isInt({ min: 1 }),
    body('amount').isNumeric(),
    body('paymentMethod').trim().notEmpty(),
    body('cardLast4').isLength({ min: 4, max: 4 }),
    validateRequest,
  ],
  asyncHandler(paymentController.createPayment),
);
router.get('/payments', requireRole(['admin']), asyncHandler(paymentController.listPayments));
router.delete('/payments/:id', requireRole(['admin']), asyncHandler(paymentController.deletePayment));

export default router;
