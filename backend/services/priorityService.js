/**
 * AI Priority Engine
 * Calculates dynamic priority score (0-100) and level based on surplus risk and time remaining.
 */

export const calculatePriority = (donation, riskResult) => {
  const { pickupEnd, quantity } = donation;

  const now = new Date();
  const endTime = pickupEnd ? new Date(pickupEnd) : new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const hoursLeft = Math.max(0, (endTime.getTime() - now.getTime()) / (1000 * 60 * 60));

  let timeUrgencyBonus = 0;
  if (hoursLeft <= 1) {
    timeUrgencyBonus = 15;
  } else if (hoursLeft <= 2) {
    timeUrgencyBonus = 10;
  } else if (hoursLeft <= 4) {
    timeUrgencyBonus = 5;
  }

  const priorityScore = Math.min(100, Math.max(10, Math.round(riskResult.score + timeUrgencyBonus)));

  let level = 'LOW';
  if (priorityScore >= 81) {
    level = 'CRITICAL';
  } else if (priorityScore >= 66) {
    level = 'HIGH';
  } else if (priorityScore >= 36) {
    level = 'MEDIUM';
  }

  return {
    score: priorityScore,
    level,
  };
};
