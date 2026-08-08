import Donation from '../models/Donation.js';
import { runFullAIAnalysis } from '../services/aiService.js';

/**
 * @desc    Analyze a donation using AI (Risk, Priority, Matching & Explanations)
 * @route   POST /api/ai/analyze
 * @access  Private
 */
export const analyzeDonationHandler = async (req, res) => {
  try {
    const donationData = req.body;

    let donation = donationData;
    if (donationData.donationId || donationData._id) {
      const existing = await Donation.findById(donationData.donationId || donationData._id);
      if (existing) donation = existing;
    }

    const aiResult = await runFullAIAnalysis(donation);

    res.status(200).json({
      success: true,
      donationId: aiResult.donationId,
      riskScore: aiResult.riskScore,
      riskLevel: aiResult.riskLevel,
      priority: aiResult.priority,
      priorityScore: aiResult.priorityScore,
      reasons: aiResult.reasons,
      matches: aiResult.matches,
      analyzedAt: aiResult.analyzedAt,
    });
  } catch (error) {
    console.error('[AI Controller - Analyze Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during AI analysis',
    });
  }
};

/**
 * @desc    Get matched receivers for a specific donation ID
 * @route   GET /api/ai/match/:donationId
 * @access  Private
 */
export const getMatchedReceiversHandler = async (req, res) => {
  try {
    const { donationId } = req.params;
    let donation = await Donation.findById(donationId);

    if (!donation) {
      // Fallback object if mock/demo ID is passed
      donation = {
        _id: donationId,
        foodType: 'Vegetarian Meals',
        quantity: 120,
        unit: 'meals',
        pickupEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
        location: { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
      };
    }

    const aiResult = await runFullAIAnalysis(donation);

    res.status(200).json({
      success: true,
      receivers: aiResult.matches,
    });
  } catch (error) {
    console.error('[AI Controller - GetMatch Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching matched receivers',
    });
  }
};
