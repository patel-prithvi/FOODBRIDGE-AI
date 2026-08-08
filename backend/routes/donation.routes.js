import express from 'express';
import {
  getAvailableDonations,
  getMyDonations,
  getPendingOffers,
  getDonationById,
  createDonation,
  selectReceiver,
  acceptDonation,
  declineDonation,
  markPickedUp,
  completeDonation,
} from '../controllers/donation.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Named routes BEFORE /:id param routes to avoid conflicts
router.get('/available', getAvailableDonations);
router.get('/my', authorize('DONOR'), getMyDonations);
router.get('/pending-offers', authorize('RECEIVER'), getPendingOffers);
router.post('/', authorize('DONOR'), createDonation);

// Donation actions
router.post('/:id/select-receiver', authorize('DONOR'), selectReceiver);
router.post('/:id/accept', authorize('RECEIVER'), acceptDonation);
router.post('/:id/decline', authorize('RECEIVER'), declineDonation);
router.post('/:id/pickup', markPickedUp);
router.post('/:id/complete', completeDonation);

// Generic ID route LAST
router.get('/:id', getDonationById);

export default router;
