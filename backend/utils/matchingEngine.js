import natural from 'natural';
import imghash from 'imghash';
import axios from 'axios';

// Expose a public API to compute the perceptual hash
export const computeImageHash = async (url) => {
  if (!url) return null;
  try {
    const response = await axios({ url, responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    return await imghash.hash(buffer, 8); // 8-bit hash (64-bit Hex)
  } catch (error) {
    console.error('Fast-Hasing Error:', error.message);
    return null;
  }
};

// Calculate Hex string hamming distance
const hexToBin = (hexStr) => hexStr.split('').map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
const calculateHammingDistance = (hash1, hash2) => {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64; // Max distance
  const bin1 = hexToBin(hash1);
  const bin2 = hexToBin(hash2);
  let distance = 0;
  for (let i = 0; i < bin1.length; i++) {
    if (bin1[i] !== bin2[i]) distance++;
  }
  return distance;
};

export const extractKeywords = (text) => {
  if (!text || typeof text !== 'string') return [];
  // Tokenize and Stem converts sentences into arrays of root English words, removing punctuation & stop words flawlessly.
  return natural.PorterStemmer.tokenizeAndStem(text);
};

export const calculateOverlapSimilarity = (text1, text2) => {
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  if (set1.size === 0 || set2.size === 0) return 0;
  
  // Use fuzzy JaroWinkler matching to forgive typos between stemmed sets!
  let overlapScore = 0;
  for (const word1 of set1) {
    let bestMatch = 0;
    for (const word2 of set2) {
      if (word1 === word2) {
        bestMatch = 1; break;
      }
      const similarity = natural.JaroWinklerDistance(word1, word2);
      if (similarity > bestMatch) bestMatch = similarity;
    }
    if (bestMatch > 0.85) { // Only count highly similar stems as an overlap
      overlapScore += bestMatch;
    }
  }
  
  return overlapScore / Math.min(set1.size, set2.size);
};

export const evaluateItemMatch = (lostItem, foundItem) => {
  let totalScore = 0;
  const breakdown = { category: 0, title: 0, description: 0, location: 0, image: 0 };
  const bothHaveImages = !!(lostItem.imageHash && foundItem.imageHash);

  // ── TEXT-BASED SCORING ────────────────────────────────────────────────────
  // Max possible from text alone = 100 (20 + 40 + 20 + 20)
  // This ensures text-only items can still trigger a match.

  // 1. Category match (+20 pts)
  if (lostItem.category === foundItem.category) {
    breakdown.category = 20;
    totalScore += 20;
  }

  // 2. Title similarity (up to 40 pts) — NLP stemmed + Jaro-Winkler fuzzy
  const titleScore = calculateOverlapSimilarity(lostItem.title, foundItem.title) * 40;
  breakdown.title = Math.round(titleScore);
  totalScore += titleScore;

  // 3. Description similarity (up to 20 pts)
  const descScore = calculateOverlapSimilarity(lostItem.description, foundItem.description) * 20;
  breakdown.description = Math.round(descScore);
  totalScore += descScore;

  // 4. Fuzzy location match (up to 20 pts) — "Library" ≈ "Central Library"
  const loc1 = (lostItem.location || '').toLowerCase().trim();
  const loc2 = (foundItem.location || '').toLowerCase().trim();
  if (loc1 && loc2) {
    const locSimilarity = natural.JaroWinklerDistance(loc1, loc2);
    if (locSimilarity > 0.70) {
      const locationScore = locSimilarity * 20;
      breakdown.location = Math.round(locationScore);
      totalScore += locationScore;
    }
  }

  // ── IMAGE SCORING (DOMINANT PRIORITY) ────────────────────────────────────
  // If both items have images, add up to +40 bonus points (capped at 100).
  // This makes image matching the STRONGEST signal when available.
  if (bothHaveImages) {
    const hammingDist = calculateHammingDistance(lostItem.imageHash, foundItem.imageHash);
    if (hammingDist <= 25) {
      // 0 dist = 40 pts, 25 dist = 0 pts — exponential decay
      const imageScore = 40 * Math.pow(1 - hammingDist / 25, 1.5);
      breakdown.image = Math.round(imageScore);
      totalScore += imageScore;
    }
  }

  // Cap at 100
  totalScore = Math.min(100, Math.round(totalScore));

  // ── DYNAMIC THRESHOLD ─────────────────────────────────────────────────────
  // If both have images, require lower threshold (images carry more weight).
  // Pure text match requires 60+ (eg. Title(40) + Category(20) = 60).
  const threshold = bothHaveImages ? 50 : 60;

  return {
    score: totalScore,
    isMatch: totalScore >= threshold,
    breakdown
  };
};
