import { calculateSurplusRisk } from './riskService.js';
import { calculatePriority } from './priorityService.js';
import { matchAndRankReceivers } from './matchingService.js';
import { generateMatchExplanations } from './explanationService.js';
import Donation from '../models/Donation.js';

/**
 * Perform Complete AI Analysis for a Donation.
 * Coordinates Risk Engine, Priority Engine, Receiver Matching, and Gemini Explanation.
 */
export const runFullAIAnalysis = async (donation) => {
  // 1. Calculate Surplus Risk (0-100)
  const risk = calculateSurplusRisk(donation);

  // 2. Calculate Priority (0-100)
  const priority = calculatePriority(donation, risk);

  // 3. Filter & Rank Eligible Receivers
  const rankedReceivers = await matchAndRankReceivers(donation);

  // 4. Generate Explanations via Gemini API (with Fallback)
  const matchesWithExplanations = await generateMatchExplanations(donation, risk, rankedReceivers);

  // 5. Build AI Response Payload
  const aiAnalysisResult = {
    donationId: donation._id,
    riskScore: risk.score,
    riskLevel: risk.level,
    priority: priority.level,
    priorityScore: priority.score,
    reasons: risk.reasons,
    matches: matchesWithExplanations,
    analyzedAt: new Date().toISOString(),
  };

  // 6. Optional AI Persistence in MongoDB Donation document
  if (donation._id) {
    try {
      await Donation.findByIdAndUpdate(donation._id, {
        aiRisk: risk.score,
        aiPriority: priority.level,
        aiScore: matchesWithExplanations[0]?.matchScore || 90,
        aiAnalysis: aiAnalysisResult,
      });
    } catch (err) {
      console.warn('[AI Service] Failed to persist AI analysis in DB:', err.message);
    }
  }

  return aiAnalysisResult;
};
