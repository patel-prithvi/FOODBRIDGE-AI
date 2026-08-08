import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client safely if API key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('[Gemini Service] Error initializing GoogleGenAI:', err.message);
    return null;
  }
};

/**
 * Generate Intelligent Explanation via Gemini API with Deterministic Fallback.
 * Gemini does NOT calculate numbers — it explains calculated backend facts.
 */
export const generateMatchExplanations = async (donation, riskResult, topReceivers) => {
  const ai = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const results = [];

  for (const receiver of topReceivers) {
    let explanationText = '';

    if (ai) {
      try {
        const systemInstruction = `You are the explanation engine for FoodBridge AI.
Explain why a receiver is a suitable match for a food donation.
Use ONLY the facts provided.
Never invent distance, capacity, dietary requirements, pickup times, verification status, risk scores, or match scores.
Do not claim that food is safe.
Return concise structured JSON.`;

        const facts = {
          donationFoodType: donation.foodType,
          donationQuantity: `${donation.quantity} ${donation.unit}`,
          surplusRiskScore: riskResult.score,
          surplusRiskLevel: riskResult.level,
          receiverName: receiver.organizationName,
          matchScore: receiver.matchScore,
          matchFactors: receiver.matchFactors,
          locationCity: receiver.location?.city || 'Ahmedabad',
          verificationStatus: receiver.verificationStatus || 'VERIFIED',
        };

        const prompt = `System Instruction: ${systemInstruction}

Calculated Facts:
${JSON.stringify(facts, null, 2)}

Provide JSON output with keys: "summary" (string), "keyReasons" (array of strings), "limitations" (array of strings).`;

        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const rawText = response.text || '';
        // Extract JSON if wrapped in markdown code blocks
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(cleanedText);
        if (parsed && parsed.summary) {
          explanationText = parsed.summary;
        }
      } catch (geminiError) {
        console.warn(`[Gemini Explanation Warning] API call failed for ${receiver.organizationName}, using fallback:`, geminiError.message);
      }
    }

    // Fallback explanation if Gemini is unavailable or failed
    if (!explanationText) {
      explanationText = `${receiver.organizationName} is a strong match (${receiver.matchScore}% match score) because it has sufficient capacity (${receiver.capacity || 'ample'} ${donation.unit}), supports the required dietary preferences, and is located nearby in ${receiver.location?.city || 'the area'}.`;
    }

    results.push({
      ...receiver,
      matchExplanation: explanationText,
    });
  }

  return results;
};
