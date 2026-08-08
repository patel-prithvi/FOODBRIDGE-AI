import express from 'express';
import {
  createFoodRequest,
  getFoodRequestById,
  getActiveRequest,
  updateFoodRequest,
} from '../controllers/request.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Only authenticated users with role RECEIVER can access these routes
router.use(protect);
router.use(authorize('RECEIVER'));

// GET active request must come BEFORE /:id to avoid "active" being treated as an ID
router.get('/active', getActiveRequest);
router.post('/', createFoodRequest);
router.get('/:id', getFoodRequestById);
router.put('/:id', updateFoodRequest);

export default router;
