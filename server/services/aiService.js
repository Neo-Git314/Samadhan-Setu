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

export default {
  classifyComplaint,
  analyzeImage,
  getEmbedding
};
