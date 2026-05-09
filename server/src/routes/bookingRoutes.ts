import { Router } from 'express';
import { body } from 'express-validator';
import * as bookingController from '../controllers/bookingController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.post(
  '/bookings',
  requireRole(['customer']),
  [
    body('roomId').isInt({ min: 1 }),
    body('checkInDate').isISO8601(),
    body('checkOutDate').isISO8601(),
    validateRequest,
  ],
  asyncHandler(bookingController.createBooking),
);
router.get('/bookings', requireRole(['admin']), asyncHandler(bookingController.listAllBookings));
router.get('/bookings/:customerId', asyncHandler(bookingController.listCustomerBookings));
router.patch('/bookings/:id/check-in', requireRole(['admin']), asyncHandler(bookingController.checkInBooking));
router.patch('/bookings/:id/complete', requireRole(['admin']), asyncHandler(bookingController.completeBooking));
router.patch(
  '/bookings/:id/cancel',
  [body('reason').optional().isString(), validateRequest],
  asyncHandler(bookingController.cancelBooking),
);
router.patch(
  '/bookings/:id/notes',
  requireRole(['admin']),
  [body('notes').isString(), validateRequest],
  asyncHandler(bookingController.updateInternalNotes),
);
router.delete('/bookings/:id', requireRole(['admin']), asyncHandler(bookingController.deleteBooking));

export default router;
