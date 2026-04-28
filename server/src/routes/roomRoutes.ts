import { Router } from 'express';
import { body } from 'express-validator';
import * as roomController from '../controllers/roomController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/rooms', asyncHandler(roomController.listRooms));
router.get('/rooms/:id', asyncHandler(roomController.getRoom));
router.post(
  '/rooms',
  requireAuth,
  requireRole(['admin']),
  [
    body('hotelId').isInt({ min: 1 }),
    body('name').trim().notEmpty(),
    body('roomType').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('bedType').trim().notEmpty(),
    body('sizeSqm').isNumeric(),
    body('capacityAdults').isInt({ min: 1 }),
    body('capacityChildren').isInt({ min: 0 }),
    body('pricePerNight').isNumeric(),
    body('totalInventory').isInt({ min: 1 }),
    body('amenities').isArray(),
    validateRequest,
  ],
  asyncHandler(roomController.createRoom),
);
router.put(
  '/rooms/:id',
  requireAuth,
  requireRole(['admin']),
  [
    body('hotelId').isInt({ min: 1 }),
    body('name').trim().notEmpty(),
    body('roomType').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('bedType').trim().notEmpty(),
    body('sizeSqm').isNumeric(),
    body('capacityAdults').isInt({ min: 1 }),
    body('capacityChildren').isInt({ min: 0 }),
    body('pricePerNight').isNumeric(),
    body('totalInventory').isInt({ min: 1 }),
    body('amenities').isArray(),
    validateRequest,
  ],
  asyncHandler(roomController.updateRoom),
);
router.delete('/rooms/:id', requireAuth, requireRole(['admin']), asyncHandler(roomController.deleteRoom));

export default router;
