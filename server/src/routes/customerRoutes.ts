import { Router } from 'express';
import { body } from 'express-validator';
import * as customerController from '../controllers/customerController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/customers', requireRole(['admin']), asyncHandler(customerController.listCustomers));
router.get('/customers/:id', asyncHandler(customerController.getCustomer));
router.put(
  '/customers/:id',
  [body('fullName').trim().notEmpty(), body('phoneNumber').optional().isString(), validateRequest],
  asyncHandler(customerController.updateCustomer),
);
router.delete('/customers/:id', requireRole(['admin']), asyncHandler(customerController.deleteCustomer));

export default router;
