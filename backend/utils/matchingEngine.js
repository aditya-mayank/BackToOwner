const STOP_WORDS = new Set([
  'a', 'an', 'the', 'with', 'in', 'on', 'at', 'found', 'lost', 
  'of', 'and', 'is', 'some', 'was', 'near', 'my', 'it'
]);

export const extractKeywords = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  // Lowercase, remove punctuation, split on whitespace
  const rawWords = text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  
  // Filter out stop words and words under 2 chars
  return rawWords.filter(word => word.length >= 2 && !STOP_WORDS.has(word));
};

export const calculateOverlapSimilarity = (text1, text2) => {
  const keywords1 = extractKeywords(text1);
  const keywords2 = extractKeywords(text2);
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  
  if (set1.size === 0 || set2.size === 0) return 0;
  
  // Count intersection
  let intersectionSize = 0;
  for (const word of set1) {
    if (set2.has(word)) {
      intersectionSize++;
    }
  }
  
  // Return intersection ratio relative to the smaller set
  return intersectionSize / Math.min(set1.size, set2.size);
};

export const evaluateItemMatch = (lostItem, foundItem) => {
  let totalScore = 0;
  
  // 1. Category match (+20 points)
  const categoryScore = (lostItem.category === foundItem.category) ? 20 : 0;
  totalScore += categoryScore;
  
  // 2. Title match (up to 40 points)
  const titleScore = calculateOverlapSimilarity(lostItem.title, foundItem.title) * 40;
  totalScore += titleScore;
  
  // 3. Description match (up to 20 points)
  const descriptionScore = calculateOverlapSimilarity(lostItem.description, foundItem.description) * 20;
  totalScore += descriptionScore;
  
  // 4. Location match (+20 points)
  const loc1 = (lostItem.location || '').toLowerCase().trim();
  const loc2 = (foundItem.location || '').toLowerCase().trim();
  const locationScore = (loc1 === loc2 && loc1 !== '') ? 20 : 0;
  totalScore += locationScore;
  
  return {
    score: Math.round(totalScore),
    isMatch: totalScore >= 70, // 70+ is considered a valid match
    breakdown: {
      category: categoryScore,
      title: Math.round(titleScore),
      description: Math.round(descriptionScore),
      location: locationScore
    }
  };
};
