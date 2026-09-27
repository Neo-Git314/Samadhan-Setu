import axios from 'axios';

const VALID_CATEGORIES = [
  'education',
  'agriculture',
  'healthcare',
  'water_resources',
  'environment',
  'energy',
  'urban_development',
  'accessibility',
  'public_administration',
  'rural_livelihoods'
];

/**
 * Generate deterministic fallback embedding vector (768 dimensions)
 * Used when GEMINI_API_KEY is not configured in development or test environments.
 */
const generateDeterministicVector = (text, dimensions = 768) => {
  const vec = new Array(dimensions).fill(0);
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  if (words.length === 0) return vec;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vec[idx] += 1;
  }

  // Normalize to unit length
  const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
  return norm > 0 ? vec.map((v) => v / norm) : vec;
};

/**
 * 1. Classify civic complaint text into Jharkhand categories with confidence & urgency
 * @param {string} text - Complaint title and description
 * @returns {Promise<{ category: string, confidence: number, urgency: string, keywords: string[] }>}
 */
export const classifyComplaint = async (text) => {
  const fallback = {
    category: 'uncategorized',
    confidence: 0,
    urgency: 'medium',
    keywords: []
  };

  if (!text || typeof text !== 'string' || !text.trim()) {
    return fallback;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `System: You are a classifier for civic complaints in Jharkhand, India.
Categories: education, agriculture, healthcare, water_resources, environment, energy, urban_development, accessibility, public_administration, rural_livelihoods.

Given the complaint text below, return ONLY valid JSON:
{
  "category": "<one of the categories above>",
  "confidence": <0-1>,
  "urgency": "low" | "medium" | "high",
  "keywords": ["...", "..."]
}

Complaint: "${text}"`;

  if (!apiKey) {
    console.warn('[aiService] GEMINI_API_KEY not set. Using heuristic rule-based classifier.');
    const lower = text.toLowerCase();
    let matchedCategory = 'uncategorized';
    let confidence = 0.5;
    let urgency = 'medium';
    const keywords = [];

    if (lower.includes('water') || lower.includes('pump') || lower.includes('well') || lower.includes('drain')) {
      matchedCategory = 'water_resources';
      confidence = 0.85;
      keywords.push('water', 'handpump');
    } else if (lower.includes('school') || lower.includes('student') || lower.includes('teacher') || lower.includes('education')) {
      matchedCategory = 'education';
      confidence = 0.85;
      keywords.push('education', 'school');
    } else if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('clinic') || lower.includes('health')) {
      matchedCategory = 'healthcare';
      confidence = 0.85;
      keywords.push('health', 'clinic');
    } else if (lower.includes('garbage') || lower.includes('waste') || lower.includes('pollution') || lower.includes('tree')) {
      matchedCategory = 'environment';
      confidence = 0.8;
      keywords.push('waste', 'environment');
    } else if (lower.includes('road') || lower.includes('pothole') || lower.includes('street') || lower.includes('traffic')) {
      matchedCategory = 'urban_development';
      confidence = 0.8;
      keywords.push('road', 'infrastructure');
    } else if (lower.includes('electric') || lower.includes('power') || lower.includes('light') || lower.includes('wire')) {
      matchedCategory = 'energy';
      confidence = 0.8;
      keywords.push('power', 'energy');
    } else if (lower.includes('crop') || lower.includes('farmer') || lower.includes('irrigation') || lower.includes('soil')) {
      matchedCategory = 'agriculture';
      confidence = 0.85;
      keywords.push('farming', 'crops');
    }

    if (lower.includes('urgent') || lower.includes('danger') || lower.includes('hazard') || lower.includes('broken')) {
      urgency = 'high';
    }

    return { category: matchedCategory, confidence, urgency, keywords };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      },
      { timeout: 10000 }
    );

    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      console.warn('[aiService] Empty candidate text from Gemini classification');
      return fallback;
    }

    const cleanedJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      category: VALID_CATEGORIES.includes(parsed.category?.toLowerCase())
        ? parsed.category.toLowerCase()
        : 'uncategorized',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      urgency: ['low', 'medium', 'high'].includes(parsed.urgency) ? parsed.urgency : 'medium',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
    };
  } catch (error) {
    console.error('[aiService] classifyComplaint error:', error.message);
    return fallback;
  }
};

/**
 * 2. Analyze image using Gemini Vision for civic infrastructure context
 * @param {string} imageUrl - URL of image (e.g. Cloudinary)
 * @param {string} descriptionContext - Accompanying complaint description
 * @returns {Promise<{ caption: string, tags: string[], relevanceScore: number }>}
 */
export const analyzeImage = async (imageUrl, descriptionContext = '') => {
  const fallback = { caption: '', tags: [], relevanceScore: 0 };

  if (!imageUrl || typeof imageUrl !== 'string') {
    return fallback;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[aiService] GEMINI_API_KEY not set. Returning default vision analysis.');
    return {
      caption: descriptionContext ? `Visual issue matching: ${descriptionContext.slice(0, 60)}` : 'Civic issue observed',
      tags: ['civic_infrastructure', 'jharkhand'],
      relevanceScore: 0.85
    };
  }

  try {
    // Download image buffer
    const imgResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 8000
    });

    const buffer = Buffer.from(imgResponse.data);
    const base64Data = buffer.toString('base64');
    const mimeType = imgResponse.headers['content-type'] || 'image/jpeg';

    const prompt = `Describe this image in one sentence, focused on any civic/infrastructure/environmental issue visible. Then return JSON:
{ "caption": "...", "tags": ["...", "..."], "relevanceScore": <0-1> }

Complaint description for context: "${descriptionContext}"`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      },
      { timeout: 12000 }
    );

    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return fallback;

    const cleanedJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      caption: parsed.caption || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      relevanceScore:
        typeof parsed.relevanceScore === 'number'
          ? parsed.relevanceScore
          : typeof parsed.relevanceToText === 'number'
          ? parsed.relevanceToText
          : 0
    };
  } catch (error) {
    console.error('[aiService] analyzeImage error:', error.message);
    return fallback;
  }
};

/**
 * 3. Generate embedding vector using Gemini text-embedding-004 model
 * @param {string} text - Input text
 * @returns {Promise<number[]>} - Array of floats
 */
export const getEmbedding = async (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return [];
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('[aiService] GEMINI_API_KEY not set. Generating deterministic vector for local/test mode.');
    return generateDeterministicVector(text);
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const response = await axios.post(
      url,
      {
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text }]
        }
      },
      { timeout: 10000 }
    );

    const values = response.data?.embedding?.values;
    if (Array.isArray(values) && values.length > 0) {
      return values;
    }

    console.warn('[aiService] No embedding values returned from Gemini');
    return [];
  } catch (error) {
    console.error('[aiService] getEmbedding error:', error.message);
    return [];
  }
};

/**
 * 4. Screen societal challenges vs routine municipal maintenance issues (SIH 26043)
 * Evaluates whether an issue is a systemic societal challenge requiring innovation/R&D
 * or a routine service issue requiring standard local grievance redressal.
 * @param {string} title
 * @param {string} description
 * @param {string} category
 * @param {object} location
 * @param {string} imageCaption
 * @returns {Promise<{
 *   classification: 'validated_societal_challenge' | 'routine_service_issue' | 'needs_expert_review',
 *   confidence: number,
 *   reason: string,
 *   innovationPotential: 'high' | 'medium' | 'low' | 'none',
 *   researchDomain: string,
 *   prioritizationScore: number,
 *   citizenGuidance: string
 * }>}
 */
export const screenSocietalChallenge = async ({
  title = '',
  description = '',
  category = '',
  location = {},
  imageCaption = ''
} = {}) => {
  const combinedText = `${title}. ${description}. Category: ${category}. Image context: ${imageCaption}`.trim();

  const fallback = {
    classification: 'needs_expert_review',
    confidence: 0.5,
    reason: 'Challenge flagged for administrative review and expert validation.',
    innovationPotential: 'medium',
    researchDomain: category || 'Societal Innovation',
    prioritizationScore: 50,
    citizenGuidance: ''
  };

  if (!combinedText) {
    return fallback;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `System: You are an expert AI innovation screener for "Samadhan Setu" (Societal Innovation Collaboration Portal).
Your role is to classify citizen-submitted problems into:
1. "validated_societal_challenge": Systemic, community-wide, recurring, ecological, technological, agricultural, healthcare, or socio-economic challenges that require academic research, R&D, student innovation, technology transfer, prototype engineering, or startup problem solving. (e.g. arsenic/fluoride in groundwater, lack of affordable solar cold-storage for tribal grain, off-grid telemedicine diagnostics, smart flood prediction, endemic crop pest control).
2. "routine_service_issue": Isolated, standard municipal maintenance or individual civil issues that do not warrant innovation research (e.g. single pothole repair, single fused streetlight bulb, isolated handpump washer change, routine garbage bin pickup, individual water bill dispute).
3. "needs_expert_review": Ambiguous, complex, multi-sector, or insufficiently clear submissions where AI confidence is low.

Evaluate the problem and return ONLY valid JSON:
{
  "classification": "validated_societal_challenge" | "routine_service_issue" | "needs_expert_review",
  "confidence": <float between 0.0 and 1.0>,
  "reason": "<1-2 clear concise sentences explaining the classification>",
  "innovationPotential": "high" | "medium" | "low" | "none",
  "researchDomain": "<Appropriate R&D domain, e.g. Agritech, Water Purification, Renewable Energy, Healthtech, Smart Urban Systems, Rural Engineering>",
  "prioritizationScore": <integer between 10 and 100 based on community impact, severity, scalability, and innovation need>,
  "citizenGuidance": "<If routine_service_issue, provide helpful generic guidance on directing to standard municipal channels or local public service portals; otherwise leave empty string ''>"
}

Submission Title: "${title}"
Description: "${description}"
Category: "${category}"
Location Details: "${location?.address || location?.district || 'Jharkhand'}"
Vision Context: "${imageCaption}"`;

  if (!apiKey) {
    console.warn('[aiService] GEMINI_API_KEY not set. Using heuristic challenge screener.');
    const lower = combinedText.toLowerCase();

    // Routine triggers: single pothole, street light fused, garbage bin, single tap leak
    const isRoutine =
      (lower.includes('street light') || lower.includes('streetlight') || lower.includes('bulb') || lower.includes('fused')) &&
      !lower.includes('solar grid') &&
      !lower.includes('systemic') &&
      !lower.includes('village-wide') ||
      (lower.includes('pothole') && !lower.includes('recurrent erosion') && !lower.includes('soil mechanics')) ||
      (lower.includes('garbage bin') || lower.includes('dustbin')) ||
      (lower.includes('broken tap') || lower.includes('washer'));

    // Societal Innovation triggers: systemic, contamination, arsenic, solar storage, telemedicine, crop disease, irrigation, flood, remote, indigenous
    const isInnovation =
      lower.includes('arsenic') ||
      lower.includes('fluoride') ||
      lower.includes('groundwater') ||
      lower.includes('cold storage') ||
      lower.includes('cold-storage') ||
      lower.includes('telemedicine') ||
      lower.includes('diagnostic') ||
      lower.includes('irrigation') ||
      lower.includes('flood') ||
      lower.includes('crop disease') ||
      lower.includes('renewable') ||
      lower.includes('biomass') ||
      lower.includes('micro-grid') ||
      lower.includes('tribal') ||
      lower.includes('systemic') ||
      lower.includes('water purification') ||
      lower.includes('early warning') ||
      lower.includes('affordab') ||
      lower.includes('post-harvest');

    if (isRoutine && !isInnovation) {
      return {
        classification: 'routine_service_issue',
        confidence: 0.88,
        reason: 'This submission relates to localized municipal maintenance rather than a systemic challenge requiring academic R&D or technology innovation.',
        innovationPotential: 'none',
        researchDomain: 'Municipal Operations',
        prioritizationScore: 25,
        citizenGuidance: 'This item is not suitable for the societal innovation challenge pipeline. For localized civic repairs, please register a ticket with your local municipal corporation, district portal, or relevant public service desk.'
      };
    }

    if (isInnovation) {
      let domain = 'Societal Innovation';
      if (lower.includes('water') || lower.includes('arsenic') || lower.includes('purification')) domain = 'Water & Environmental Engineering';
      else if (lower.includes('cold') || lower.includes('crop') || lower.includes('harvest') || lower.includes('irrigation')) domain = 'Agritech & Post-Harvest Systems';
      else if (lower.includes('telemedicine') || lower.includes('diagnostic') || lower.includes('health')) domain = 'Healthtech & Remote Diagnostics';
      else if (lower.includes('flood') || lower.includes('sensor') || lower.includes('urban')) domain = 'Smart Infrastructure & Disaster Tech';
      else if (lower.includes('solar') || lower.includes('energy') || lower.includes('biomass')) domain = 'Renewable & Distributed Energy';

      return {
        classification: 'validated_societal_challenge',
        confidence: 0.92,
        reason: 'Identified as a systemic community problem with strong potential for applied research, university prototyping, and industry solution co-creation.',
        innovationPotential: 'high',
        researchDomain: domain,
        prioritizationScore: 85,
        citizenGuidance: ''
      };
    }

    return {
      classification: 'needs_expert_review',
      confidence: 0.65,
      reason: 'Queued for committee review to assess innovation scope, research feasibility, and interdisciplinary problem matching.',
      innovationPotential: 'medium',
      researchDomain: category || 'Interdisciplinary R&D',
      prioritizationScore: 60,
      citizenGuidance: ''
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      },
      { timeout: 12000 }
    );

    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return fallback;

    const cleanedJson = candidateText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    const validClassifications = ['validated_societal_challenge', 'routine_service_issue', 'needs_expert_review'];
    const validInnovation = ['high', 'medium', 'low', 'none'];

    return {
      classification: validClassifications.includes(parsed.classification) ? parsed.classification : 'needs_expert_review',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.7,
      reason: parsed.reason || fallback.reason,
      innovationPotential: validInnovation.includes(parsed.innovationPotential) ? parsed.innovationPotential : 'medium',
      researchDomain: parsed.researchDomain || category || 'Societal Innovation',
      prioritizationScore: typeof parsed.prioritizationScore === 'number' ? Math.min(100, Math.max(10, parsed.prioritizationScore)) : 50,
      citizenGuidance: parsed.citizenGuidance || ''
    };
  } catch (error) {
    console.error('[aiService] screenSocietalChallenge error:', error.message);
    return fallback;
  }
};

export default {
  classifyComplaint,
  analyzeImage,
  getEmbedding,
  screenSocietalChallenge
};

