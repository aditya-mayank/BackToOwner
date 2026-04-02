import { uploadImage } from '../utils/cloudinary.js';
import { extractKeywords, evaluateItemMatch } from '../utils/matchingEngine.js';
import Item from '../models/Item.model.js';
import { initiateChat } from './chat.controller.js';

export const reportFoundItem = async (req, res) => {
  try {
    const { title, description, category, location, dateLost } = req.body;

    // 1. Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, category, and location.' });
    }

    // 2. Validate category
    const validCategories = ['Electronics', 'Stationery', 'Clothing', 'Accessories', 'ID Card', 'Keys', 'Books', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category selected.' });
    }

    // 3. Optional Image processing
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadImage(req.file.buffer);
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(400).json({ success: false, message: 'Image upload failed. Please try again.' });
      }
    }

    // 4. Construct and Save Item
    const savedItem = await new Item({
      reportedBy: req.user._id,
      title,
      description,
      category,
      location,
      dateLost: dateLost || null,
      imageUrl,
      status: 'active',
      visibility: 'private',
      type: 'found'
    }).save();

    // 5. Matching logic
    const lostItems = await Item.find({ type: 'lost', status: 'active' });
    let matchesFound = 0;
    
    for (const lostItem of lostItems) {
      const matchResult = evaluateItemMatch(savedItem, lostItem);
      if (matchResult.score >= 70) {
        matchesFound++;
        const mockReq = {
          body: {
            lostItemId: lostItem._id,
            foundItemId: savedItem._id,
            loserId: lostItem.reportedBy,
            finderId: savedItem.reportedBy
          }
        };
        const mockRes = { status: () => ({ json: () => {} }) };
        await initiateChat(mockReq, mockRes);
      }
    }

    // 6. Success Response
    res.status(201).json({
      success: true,
      message: 'Found item reported successfully.',
      item: savedItem,
      matchesFound
    });

  } catch (error) {
    console.error('Error in reportFoundItem controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const reportLostItem = async (req, res) => {
  try {
    const { title, description, category, location, visibility, dateLost } = req.body;

    // 1. Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, category, and location.' });
    }

    // 2. Validate category
    const validCategories = ['Electronics', 'Stationery', 'Clothing', 'Accessories', 'ID Card', 'Keys', 'Books', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category selected.' });
    }

    // 3. Optional Image processing
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadImage(req.file.buffer);
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        return res.status(400).json({ success: false, message: 'Image upload failed. Please try again.' });
      }
    }

    // 4. Resolve visibility
    const itemVisibility = (visibility === 'private' || visibility === 'public') ? visibility : 'public';

    // 5. Construct and Save Item Object
    const savedItem = await new Item({
      reportedBy: req.user._id,
      title,
      description,
      category,
      location,
      dateLost: dateLost || null,
      imageUrl,
      status: 'active',
      visibility: itemVisibility,
      type: 'lost'
    }).save();

    // 6. Matching logic
    const foundItems = await Item.find({ type: 'found', status: 'active', visibility: 'private' });
    const matches = [];

    for (const foundItem of foundItems) {
      const matchResult = evaluateItemMatch(savedItem, foundItem);
      if (matchResult.score >= 70) {
        matches.push({ foundItemId: foundItem._id, score: matchResult.score });
        const mockReq = {
          body: {
            lostItemId: savedItem._id,
            foundItemId: foundItem._id,
            loserId: savedItem.reportedBy,
            finderId: foundItem.reportedBy
          }
        };
        const mockRes = { status: () => ({ json: () => {} }) };
        await initiateChat(mockReq, mockRes);
      }
    }

    // 7. Success Response
    res.status(201).json({
      success: true,
      message: 'Lost item reported successfully.',
      item: savedItem,
      matches
    });

  } catch (error) {
    console.error('Error in reportLostItem controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { category, location, keyword } = req.query;

    // 1. Construct Query
    const query = { status: 'active', visibility: 'public' };
    
    if (category) {
      query.category = category;
    }
    
    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    if (keyword) {
      // Use MongoDB text search
      query.$text = { $search: keyword };
    }

    // 2. Fetch items from DB
    let dbQuery = Item.find(query).populate('reportedBy', 'name');
    
    if (keyword) {
      // Sort by text search score
      dbQuery = dbQuery.sort({ score: { $meta: 'textScore' } });
    } else {
      // Sort by newest if no keyword is provided
      dbQuery = dbQuery.sort({ createdAt: -1 });
    }

    const results = await dbQuery;

    res.status(200).json({ success: true, results });

  } catch (error) {
    console.error('Error in searchItems controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. DB Query
    const item = await Item.findById(id).populate('reportedBy', 'name');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, item });

  } catch (error) {
    console.error('Error in getItemById controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

