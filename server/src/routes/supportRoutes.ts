import { Router } from 'express';
import { body } from 'express-validator';
import * as supportController from '../controllers/supportController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/support', asyncHandler(supportController.listSupportTickets));
router.post(
  '/support',
  requireRole(['customer']),
  [
    body('bookingId').optional({ values: 'null' }).isInt({ min: 1 }),
    body('subject').trim().notEmpty(),
    body('message').trim().notEmpty(),
    validateRequest,
  ],
  asyncHandler(supportController.createSupportTicket),
);
router.patch(
  '/support/:id',
  requireRole(['admin', 'hotel_owner', 'hotel_staff']),
  [body('status').isIn(['InProgress', 'Resolved']), validateRequest],
  asyncHandler(supportController.resolveSupportTicket),
);
router.delete('/support/:id', requireRole(['admin', 'hotel_owner', 'hotel_staff']), asyncHandler(supportController.deleteSupportTicket));

export default router;
