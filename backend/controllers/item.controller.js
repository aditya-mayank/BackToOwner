import { extractKeywords, evaluateItemMatch, computeImageHash } from '../utils/matchingEngine.js';
import Item from '../models/Item.model.js';
import { initiateChat } from './chat.controller.js';
import { createInternalNotification } from './notification.controller.js';

export const reportFoundItem = async (req, res) => {
  try {
    const { title, description, category, location, dateLost, visibility } = req.body;

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
    let imageHash = null;
    if (req.file) {
      imageUrl = req.file.path; // multer-storage-cloudinary attaches the URL to req.file.path
      imageHash = await computeImageHash(imageUrl);
    }

    // 4. Construct and Save Item
    // Found items are ALWAYS private — finders contact losers privately via chat
    const itemVisibility = 'private';
    const savedItem = await new Item({
      reportedBy: req.user._id,
      title,
      description,
      category,
      location,
      dateLost: dateLost || null,
      imageUrl,
      imageHash,
      status: 'active',
      visibility: itemVisibility,
      type: 'found'
    }).save();

    // Notify the user
    await createInternalNotification(
      req.user._id,
      'Report Filed',
      `You successfully reported a found ${category}: "${title}".`,
      'info'
    );

    // 5. Matching logic
    const lostItems = await Item.find({ type: 'lost', status: 'active' });
    let matchesFound = 0;
    
    for (const lostItem of lostItems) {
      const matchResult = evaluateItemMatch(savedItem, lostItem);
      if (matchResult.isMatch) {
        matchesFound++;
        
        // Notify both parties
        await createInternalNotification(req.user._id, 'Potential Match!', `Your found item "${title}" matches a lost report.`, 'match');
        await createInternalNotification(lostItem.reportedBy, 'Item Found!', `Someone found an item matching your lost report: "${lostItem.title}".`, 'match');

        const mockReq = {
          body: {
            lostItemId: lostItem._id,
            foundItemId: savedItem._id,
            loserId: lostItem.reportedBy,
            finderId: savedItem.reportedBy,
            matchScore: matchResult.score
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
    let imageHash = null;
    if (req.file) {
      imageUrl = req.file.path; // multer-storage-cloudinary attaches the URL to req.file.path
      imageHash = await computeImageHash(imageUrl);
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
      imageHash,
      status: 'active',
      visibility: itemVisibility,
      type: 'lost'
    }).save();

    // Notify the user
    await createInternalNotification(
      req.user._id,
      'Report Filed',
      `You successfully reported a lost ${category}: "${title}". It is now ${itemVisibility}.`,
      'info'
    );

    // 6. Matching logic
    const foundItems = await Item.find({ type: 'found', status: 'active' });
    const matches = [];

    for (const foundItem of foundItems) {
      const matchResult = evaluateItemMatch(savedItem, foundItem);
      if (matchResult.isMatch) {
        matches.push({ foundItemId: foundItem._id, score: matchResult.score });

        // Notify both parties
        await createInternalNotification(req.user._id, 'Potential Match!', `Your lost item "${title}" matches a found report.`, 'match');
        await createInternalNotification(foundItem.reportedBy, 'Match Found!', `Someone reported an item matching your found report: "${savedItem.title}".`, 'match');

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
    const { category, location, keyword, reportedBy, status } = req.query;

    // 1. Construct Query
    const query = {};

    if (reportedBy) {
      // User viewing their own items — show everything including private
      query.reportedBy = reportedBy;
      if (status && status !== 'all') query.status = status;
    } else {
      // Public feed — only show LOST items that are explicitly public
      // Found items are NEVER shown publicly (finders contact via chat)
      query.type = 'lost';
      query.visibility = 'public';
      if (status && status !== 'all') {
        query.status = status;
      } else if (!status) {
        query.status = 'active';
      }
    }
    
    if (category) {
      query.category = category;
    }
    
    if (location) {
      // Escape special regex chars to prevent ReDoS
      const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.location = { $regex: new RegExp(escapedLocation, 'i') };
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

export const editItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, location, visibility } = req.body;
    
    // 1. Fetch item
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // 2. Verify ownership
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this item' });
    }

    // 3. Update fields (text only, images are immutable currently)
    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    
    // Found items MUST remain private. Only lost items can be made public.
    if (visibility && item.type === 'lost') {
      item.visibility = visibility;
    }

    await item.save();

    res.status(200).json({ success: true, message: 'Item updated successfully', item });
  } catch (error) {
    console.error('Error in editItem controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
