import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('phoneNumber').optional().isString(),
    validateRequest,
  ],
  asyncHandler(authController.register),
);

router.post(
  '/register-partner',
  [
    body('fullName').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['hotel_owner', 'hotel_staff']),
    body('ownerEmail').optional().isEmail(),
    validateRequest,
  ],
  asyncHandler(authController.registerPartner),
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty(), validateRequest],
  asyncHandler(authController.login),
);

router.get('/auth/me', requireAuth, asyncHandler(authController.me));

export default router;
