import { extractKeywords, calculateOverlapSimilarity, evaluateItemMatch } from '../utils/matchingEngine.js';

describe('Matching Engine', () => {

  describe('extractKeywords()', () => {
    it('should split string, remove punctuation, lowercase, and remove stop words', () => {
      const result = extractKeywords('Red Ball Pen');
      expect(result).toEqual(['red', 'ball', 'pen']);
    });

    it('should return an empty array if only stop words are provided', () => {
      const result = extractKeywords('a the with found');
      expect(result).toEqual([]);
    });

    it('should return an empty array for an empty string', () => {
      const result = extractKeywords('');
      expect(result).toEqual([]);
    });
  });

  describe('calculateOverlapSimilarity()', () => {
    it('should return 1.0 when smaller set is fully contained in larger set', () => {
      const result = calculateOverlapSimilarity('Red Ball Pen', 'Ball Pen');
      expect(result).toBe(1.0);
    });

    it('should return 0 when there is no overlap', () => {
      const result = calculateOverlapSimilarity('Red Ball Pen', 'Blue Marker');
      expect(result).toBe(0);
    });

    it('should return 0 when one or both inputs are empty', () => {
      const result = calculateOverlapSimilarity('', 'something');
      expect(result).toBe(0);
    });
  });

  describe('evaluateItemMatch()', () => {
    it('should return score >= 80 and isMatch: true for exact category + title + location match', () => {
      const lostItem = {
        category: 'Electronics',
        title: 'Apple iPhone 13',
        description: 'Black phone',
        location: 'Library'
      };
      const foundItem = {
        category: 'Electronics',
        title: 'Apple iPhone 13',
        description: 'No matching description text',
        location: 'library' // Case-insensitive exact match
      };
      const result = evaluateItemMatch(lostItem, foundItem);
      
      // Category (20) + Title exactly matching (40) + Location (20) = 80
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.isMatch).toBe(true);
    });

    it('should return score < 70 and isMatch: false for category mismatch + no description match', () => {
      const lostItem = {
        category: 'Electronics',
        title: 'Generic Item',
        description: 'Missing phone',
        location: 'Campus'
      };
      const foundItem = {
        category: 'Other',
        title: 'Generic Item',
        description: 'Found keys',
        location: 'Campus' // Location matches (20) + Title matches (40) = 60
      };
      const result = evaluateItemMatch(lostItem, foundItem);
      expect(result.score).toBeLessThan(70);
      expect(result.isMatch).toBe(false);
    });

    it('should properly score partial title match (2 out of 3 words)', () => {
      // 2 overlapping words, min set size is 2
      const lostItem = {
        category: 'Clothing', // 20 pts
        title: 'Blue Cotton Jacket', 
        description: '',
        location: ''
      };
      const foundItem = {
        category: 'Clothing', // 20 pts
        title: 'Cotton Jacket', 
        description: '',
        location: ''
      };
      // Overlap: 'cotton', 'jacket'. Size of smaller set is 2. 2/2 = 1.0 -> 40 points
      const expectedScore = 20 + 40; // 60
      const result = evaluateItemMatch(lostItem, foundItem);
      expect(result.score).toBe(expectedScore);
    });

    it('should return isMatch: true when score is exactly at 70 threshold', () => {
      // Category (20) + Title exact (40) + partial desc overlap
      const lostItem = {
        category: 'Books',
        title: 'Math TextBook',
        description: 'Big book cover',
        location: 'Campus1'
      };
      const foundItem = {
        category: 'Books',
        title: 'Math Textbook', // Exact match -> 40pts
        description: 'Big notes', // 'big' matches, smaller set has 2 words. 1/2 = 0.5 -> 10pts
        location: 'Campus2'
      };
      // Total: 20(cat) + 40(title) + 10(desc) = 70
      const result = evaluateItemMatch(lostItem, foundItem);
      expect(result.score).toBe(70);
      expect(result.isMatch).toBe(true);
    });

    it('should return isMatch: false when score is exactly at 69', () => {
      // Generate exactly 29 points out of 40 via the Title match
      // Title overlap ratio = 29 / 40 = 0.725
      const titleWordsLost = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ');
      const titleWordsFound = [
        ...Array.from({ length: 29 }, (_, i) => `word${i}`), // 29 matching words
        ...Array.from({ length: 11 }, (_, i) => `no${i}`) // 11 non-matching words (total size = 40)
      ].join(' ');
      
      const lostItem = {
        category: 'Electronics', // 20
        title: titleWordsLost, 
        description: 'Exact Match', // 20
        location: 'Campus1' // 0
      };
      
      const foundItem = {
        category: 'Electronics', 
        title: titleWordsFound, // 29
        description: 'Exact Match', 
        location: 'Campus2' 
      };
      
      // Total = 20(Category) + 29(Title) + 20(Description) + 0(Location) = 69
      const result = evaluateItemMatch(lostItem, foundItem);
      expect(result.score).toBe(69);
      expect(result.isMatch).toBe(false);
    });
  });
});
