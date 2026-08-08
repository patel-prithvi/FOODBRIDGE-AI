import Donation from '../models/Donation.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Seed default initial available donations if MongoDB is empty
const seedInitialDonations = async () => {
  const count = await Donation.countDocuments();
  if (count === 0) {
    console.log('[Donation Controller] Seeding initial available donations into MongoDB...');
    const initialDonations = [
      {
        foodType: 'Vegetarian Meals',
        quantity: 150,
        unit: 'meals',
        description: 'Freshly cooked dal, rice, rotis and sabzi',
        dietaryInfo: 'Vegetarian',
        preparedAt: new Date(Date.now() - 60 * 60 * 1000),
        pickupStart: new Date(Date.now() + 30 * 60 * 1000),
        pickupEnd: new Date(Date.now() + 90 * 60 * 1000),
        location: { address: '102 MG Road', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
        status: 'AVAILABLE',
        aiRisk: 91,
        aiPriority: 'CRITICAL',
        aiScore: 95,
      },
      {
        foodType: 'Vegetarian Meals',
        quantity: 80,
        unit: 'meals',
        description: 'Pulao and paneer curry package',
        dietaryInfo: 'Vegetarian, Jain',
        preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        pickupStart: new Date(Date.now() + 45 * 60 * 1000),
        pickupEnd: new Date(Date.now() + 120 * 60 * 1000),
        location: { address: '45 Ashram Road', city: 'Ahmedabad', lat: 23.0300, lng: 72.5800 },
        status: 'AVAILABLE',
        aiRisk: 75,
        aiPriority: 'HIGH',
        aiScore: 88,
      },
      {
        foodType: 'Bakery Items',
        quantity: 80,
        unit: 'pieces',
        description: 'Assorted fresh breads, rolls, and pastries',
        dietaryInfo: 'Contains Gluten',
        preparedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        pickupStart: new Date(Date.now() + 60 * 60 * 1000),
        pickupEnd: new Date(Date.now() + 180 * 60 * 1000),
        location: { address: '45 Stadium Rd', city: 'Ahmedabad', lat: 23.0400, lng: 72.5600 },
        status: 'AVAILABLE',
        aiRisk: 74,
        aiPriority: 'HIGH',
        aiScore: 88,
      },
      {
        foodType: 'Fresh Produce',
        quantity: 45,
        unit: 'kg',
        description: 'Seasonal fresh vegetables — tomatoes, spinach, onions',
        dietaryInfo: 'Vegan',
        preparedAt: new Date(Date.now() - 30 * 60 * 1000),
        pickupStart: new Date(Date.now() + 3 * 60 * 60 * 1000),
        pickupEnd: new Date(Date.now() + 5 * 60 * 60 * 1000),
        location: { address: '88 CG Road', city: 'Ahmedabad', lat: 23.0250, lng: 72.5550 },
        status: 'AVAILABLE',
        aiRisk: 52,
        aiPriority: 'MEDIUM',
        aiScore: 74,
      },
      {
        foodType: 'Non-Vegetarian Meals',
        quantity: 120,
        unit: 'meals',
        description: 'Chicken curry and rice packs',
        dietaryInfo: 'Non-Vegetarian',
        preparedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        pickupStart: new Date(Date.now() + 30 * 60 * 1000),
        pickupEnd: new Date(Date.now() + 120 * 60 * 1000),
        location: { address: '12 Bodakdev', city: 'Ahmedabad', lat: 23.0380, lng: 72.5120 },
        status: 'AVAILABLE',
        aiRisk: 82,
        aiPriority: 'HIGH',
        aiScore: 85,
      },
    ];
    await Donation.insertMany(initialDonations);
  }
};

/**
 * @desc    Get all available donations from MongoDB
 * @route   GET /api/donations/available
 * @access  Private (Authenticated users)
 */
export const getAvailableDonations = async (req, res) => {
  try {
    await seedInitialDonations();
    // Only show truly AVAILABLE donations — exclude PENDING_ACCEPTANCE and MATCHED
    const donations = await Donation.find({ status: 'AVAILABLE' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error('[Donation Controller - GetAvailable Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching available donations',
    });
  }
};

/**
 * @desc    Get logged-in Donor's donations
 * @route   GET /api/donations/my
 * @access  Private (DONOR only)
 */
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error('[Donation Controller - GetMy Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching your donations',
    });
  }
};

/**
 * @desc    Get donations pending acceptance for the logged-in receiver
 * @route   GET /api/donations/pending-offers
 * @access  Private (RECEIVER only)
 */
export const getPendingOffers = async (req, res) => {
  try {
    const receiverId = req.user._id.toString();
    // Find all donations where status is PENDING_ACCEPTANCE and matchedReceiver._id matches
    const donations = await Donation.find({ status: 'PENDING_ACCEPTANCE' })
      .populate('donorId', 'organizationName contactPerson location email')
      .sort({ updatedAt: -1 });

    // Filter to only this receiver's pending offers
    const myOffers = donations.filter((d) => {
      const matched = d.matchedReceiver;
      if (!matched) return false;
      const matchedId = matched._id ? matched._id.toString() : matched.toString();
      return matchedId === receiverId;
    });

    res.status(200).json({ success: true, donations: myOffers });
  } catch (error) {
    console.error('[Donation Controller - GetPendingOffers Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/**
 * @desc    Get single donation by ID (populated with donor info)
 * @route   GET /api/donations/:id
 * @access  Private
 */
export const getDonationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    const donation = await Donation.findById(id)
      .populate('donorId', 'organizationName contactPerson location email phone');
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.status(200).json({
      success: true,
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - GetById Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching donation details',
    });
  }
};

/**
 * @desc    Create a new Donation (DONOR)
 * @route   POST /api/donations
 * @access  Private (DONOR only)
 */
export const createDonation = async (req, res) => {
  try {
    const {
      foodType,
      quantity,
      unit,
      description,
      dietaryInfo,
      preparedAt,
      pickupStart,
      pickupEnd,
      location,
    } = req.body;

    const donation = await Donation.create({
      donorId: req.user._id,
      foodType,
      quantity: Number(quantity),
      unit,
      description,
      dietaryInfo,
      preparedAt,
      pickupStart,
      pickupEnd,
      location: location || { address: req.user.location?.address || '', city: req.user.location?.city || '' },
      status: 'AVAILABLE',
      aiRisk: Math.floor(Math.random() * 30) + 65,
      aiPriority: 'HIGH',
      aiScore: Math.floor(Math.random() * 20) + 75,
    });

    console.log('[Donation Saved to MongoDB]:', donation._id, donation.foodType);

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - Create Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating donation',
    });
  }
};

/**
 * @desc    Donor selects a receiver — sets status to PENDING_ACCEPTANCE
 * @route   POST /api/donations/:id/select-receiver
 * @access  Private (DONOR only)
 */
export const selectReceiver = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({
        success: true,
        message: 'Receiver offer sent (demo mode)',
        donation: { _id: id, status: 'PENDING_ACCEPTANCE' },
      });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    const { receiverId, receiverDetails } = req.body;

    let receiverData = receiverDetails;
    if (!receiverData && receiverId && mongoose.Types.ObjectId.isValid(receiverId)) {
      const receiver = await User.findById(receiverId).select('-password');
      if (receiver) {
        receiverData = {
          _id: receiver._id,
          organizationName: receiver.organizationName,
          contactPerson: receiver.contactPerson,
          location: receiver.location,
          verificationStatus: receiver.verificationStatus,
          capacity: receiver.capacity,
          dietaryNeeds: receiver.dietaryNeeds,
        };
      }
    }

    donation.matchedReceiver = receiverData || { _id: receiverId };
    donation.status = 'PENDING_ACCEPTANCE';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Receiver offer sent — waiting for receiver confirmation',
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - SelectReceiver Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/**
 * @desc    Receiver accepts a pending donation offer
 * @route   POST /api/donations/:id/accept
 * @access  Private (RECEIVER only)
 */
export const acceptDonation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({
        success: true,
        message: 'Donation accepted successfully (demo mode)',
        donation: { _id: id, status: 'ACCEPTED' },
      });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Set matchedReceiver to the accepting receiver if not already populated
    if (!donation.matchedReceiver && req.user) {
      donation.matchedReceiver = {
        _id: req.user._id,
        organizationName: req.user.organizationName,
        contactPerson: req.user.contactPerson,
        location: req.user.location,
      };
    }

    donation.status = 'ACCEPTED';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation accepted successfully! The donor has been notified.',
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - Accept Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error accepting donation' });
  }
};

/**
 * @desc    Receiver declines a pending donation offer
 * @route   POST /api/donations/:id/decline
 * @access  Private (RECEIVER only)
 */
export const declineDonation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({
        success: true,
        message: 'Donation declined (demo mode)',
        donation: { _id: id, status: 'AVAILABLE' },
      });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Reset back to AVAILABLE
    donation.status = 'AVAILABLE';
    donation.matchedReceiver = null;
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation declined. It has been returned to available pool.',
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - Decline Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error declining donation' });
  }
};

/**
 * @desc    Mark donation as Picked Up
 * @route   POST /api/donations/:id/pickup
 * @access  Private (Authenticated users)
 */
export const markPickedUp = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({
        success: true,
        message: 'Donation status updated to Picked Up! (demo mode)',
        donation: { _id: id, status: 'PICKED_UP' },
      });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'PICKED_UP';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation status updated to Picked Up!',
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - Pickup Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/**
 * @desc    Complete donation
 * @route   POST /api/donations/:id/complete
 * @access  Private (Authenticated users)
 */
export const completeDonation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(200).json({
        success: true,
        message: 'Donation completed! (demo mode)',
        donation: { _id: id, status: 'COMPLETED' },
      });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    donation.status = 'COMPLETED';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Donation completed!',
      donation,
    });
  } catch (error) {
    console.error('[Donation Controller - Complete Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
