import { Router } from 'express';
import { body } from 'express-validator';
import * as hotelController from '../controllers/hotelController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/hotels', asyncHandler(hotelController.listHotels));
router.get('/hotels/:id', asyncHandler(hotelController.getHotel));
router.post(
  '/hotels',
  requireAuth,
  requireRole(['admin']),
  [
    body('name').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('country').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('stars').isInt({ min: 1, max: 5 }),
    body('images').isArray({ min: 1 }),
    body('amenities').isArray(),
    validateRequest,
  ],
  asyncHandler(hotelController.createHotel),
);
router.put(
  '/hotels/:id',
  requireAuth,
  requireRole(['admin']),
  [
    body('name').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('country').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('stars').isInt({ min: 1, max: 5 }),
    body('images').isArray({ min: 1 }),
    body('amenities').isArray(),
    validateRequest,
  ],
  asyncHandler(hotelController.updateHotel),
);
router.delete('/hotels/:id', requireAuth, requireRole(['admin']), asyncHandler(hotelController.deleteHotel));

export default router;
