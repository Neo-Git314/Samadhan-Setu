import Complaint from '../models/Complaint.js';
import University from '../models/University.js';
import { getEmbedding } from './aiService.js';
import { cosineSimilarity } from './dedupService.js';

/**
 * Matches a complaint to top 3 eligible universities using:
 * finalScore = (0.6 * categoryMatch) + (0.4 * embeddingSimilarity)
 * Caches university researchEmbedding if not already computed.
 * @param {string|mongoose.Types.ObjectId} complaintId
 * @returns {Promise<Array<{ universityId: mongoose.Types.ObjectId, score: number }>>}
 */
export const matchUniversities = async (complaintId) => {
  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      console.warn(`[matchingService] Complaint not found: ${complaintId}`);
      return [];
    }

    const { category, embedding } = complaint;
    const universities = await University.find();

    if (!universities || universities.length === 0) {
      console.log('[matchingService] No universities registered in the system.');
      return [];
    }

    const scoredUniversities = [];

    for (const uni of universities) {
      // 1. Ensure university has cached researchEmbedding
      if (!Array.isArray(uni.researchEmbedding) || uni.researchEmbedding.length === 0) {
        if (Array.isArray(uni.researchKeywords) && uni.researchKeywords.length > 0) {
          const keywordText = uni.researchKeywords.join(' ');
          const generatedEmbedding = await getEmbedding(keywordText);
          if (Array.isArray(generatedEmbedding) && generatedEmbedding.length > 0) {
            uni.researchEmbedding = generatedEmbedding;
            await uni.save();
          }
        }
      }

      // 2. Category Match: 1.0 if category in university.disciplines else 0.0
      const categoryMatch =
        category &&
        Array.isArray(uni.disciplines) &&
        uni.disciplines.some((d) => d.toLowerCase() === category.toLowerCase())
          ? 1.0
          : 0.0;

      // 3. Embedding Similarity: Cosine similarity between complaint & university embeddings
      let embeddingSimilarity = 0;
      if (
        Array.isArray(embedding) &&
        embedding.length > 0 &&
        Array.isArray(uni.researchEmbedding) &&
        uni.researchEmbedding.length > 0
      ) {
        embeddingSimilarity = Math.max(0, cosineSimilarity(embedding, uni.researchEmbedding));
      }

      // 4. University Reputation Normalization (Task 8.1)
      // Normalized between 0.0 and 1.0, scaled relative to 100 max benchmark
      const rawReputation = typeof uni.reputationScore === 'number' ? uni.reputationScore : 0;
      const reputationNorm = Math.min(Math.max(0, rawReputation / 100), 1.0);

      // 5. Final Task 8.1 weighted score:
      // FinalScore = (0.5 * CategoryMatch) + (0.3 * EmbeddingSim) + (0.2 * ReputationNorm)
      const finalScore = Number(
        (0.5 * categoryMatch + 0.3 * embeddingSimilarity + 0.2 * reputationNorm).toFixed(4)
      );

      scoredUniversities.push({
        universityId: uni._id,
        score: finalScore
      });
    }

    // Sort descending by score and take top 3
    scoredUniversities.sort((a, b) => b.score - a.score);
    const top3 = scoredUniversities.slice(0, 3);

    complaint.suggestedUniversities = top3;
    await complaint.save();

    console.log(
      `[matchingService] Matched ${top3.length} universities for complaint ${complaintId}:`,
      top3.map((m) => `[Uni: ${m.universityId}, Score: ${m.score}]`).join(', ')
    );

    return top3;
  } catch (error) {
    console.error(`[matchingService] Error matching universities for ${complaintId}:`, error.message);
    return [];
  }
};

export default {
  matchUniversities
};
