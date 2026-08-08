/**
 * AI Surplus Risk Engine
 * Calculates a 0-100 risk score estimating urgency that surplus food remains unredistributed.
 */

export const calculateSurplusRisk = (donation) => {
  const { quantity, foodType, preparedAt, pickupStart, pickupEnd } = donation;

  // 1. Time Pressure (45%)
  const now = new Date();
  const endTime = pickupEnd ? new Date(pickupEnd) : new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const hoursLeft = Math.max(0, (endTime.getTime() - now.getTime()) / (1000 * 60 * 60));

  let timeScore = 30; // default low urgency
  if (hoursLeft <= 1) {
    timeScore = 98;
  } else if (hoursLeft <= 2) {
    timeScore = 88;
  } else if (hoursLeft <= 4) {
    timeScore = 72;
  } else if (hoursLeft <= 8) {
    timeScore = 48;
  }

  // 2. Quantity Urgency (30%)
  const qty = Number(quantity) || 0;
  let qtyScore = 40;
  if (qty >= 150) {
    qtyScore = 95;
  } else if (qty >= 100) {
    qtyScore = 82;
  } else if (qty >= 50) {
    qtyScore = 65;
  } else if (qty >= 20) {
    qtyScore = 45;
  }

  // 3. Food Sensitivity (15%)
  const typeLower = (foodType || '').toLowerCase();
  let sensitivityScore = 50;
  if (typeLower.includes('cooked') || typeLower.includes('meal') || typeLower.includes('dairy')) {
    sensitivityScore = 90;
  } else if (typeLower.includes('produce') || typeLower.includes('bakery') || typeLower.includes('fruit')) {
    sensitivityScore = 70;
  } else if (typeLower.includes('grain') || typeLower.includes('beverage') || typeLower.includes('cereal')) {
    sensitivityScore = 35;
  }

  // 4. Pickup Window Constraints (10%)
  let constraintScore = 40;
  if (pickupStart && pickupEnd) {
    const windowHours = (new Date(pickupEnd).getTime() - new Date(pickupStart).getTime()) / (1000 * 60 * 60);
    if (windowHours <= 1.5) {
      constraintScore = 90;
    } else if (windowHours <= 3) {
      constraintScore = 65;
    }
  }

  // Weighted total (0-100)
  const weightedScore = Math.min(
    100,
    Math.max(
      10,
      Math.round(
        timeScore * 0.45 +
        qtyScore * 0.30 +
        sensitivityScore * 0.15 +
        constraintScore * 0.10
      )
    )
  );

  // Determine Level
  let level = 'LOW';
  if (weightedScore >= 81) {
    level = 'CRITICAL';
  } else if (weightedScore >= 66) {
    level = 'HIGH';
  } else if (weightedScore >= 36) {
    level = 'MEDIUM';
  }

  // Deterministic 2-3 reasons
  const reasons = [];
  if (qty >= 100) {
    reasons.push('Large quantity relative to pickup window');
  }
  if (hoursLeft <= 3) {
    reasons.push('Limited time remaining before pickup deadline');
  } else {
    reasons.push('Tight distribution timeline');
  }
  if (sensitivityScore >= 80) {
    reasons.push('High food perishability factor');
  }

  return {
    score: weightedScore,
    level,
    reasons: reasons.slice(0, 3),
  };
};
