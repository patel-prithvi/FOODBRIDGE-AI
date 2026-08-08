import express from 'express';
import { analyzeDonationHandler, getMatchedReceiversHandler } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeDonationHandler);
router.get('/match/:donationId', getMatchedReceiversHandler);

export default router;
