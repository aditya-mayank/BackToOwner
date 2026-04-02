import { runArchivalNow } from '../utils/archivalJob.js';
import Item from '../models/Item.model.js';
import User from '../models/User.model.js';
import Chat from '../models/Chat.model.js';
export const getAllItems = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    // 1. Build Query
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    // Pagination preparation
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skipNum = (pageNum - 1) * limitNum;

    // 2. Fetch from DB
    const items = await Item.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({ success: true, count: items.length, page: pageNum, items });
  } catch (error) {
    console.error('Error in getAllItems admin controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // 1. Fetch from DB
    const users = await User.find().select('_id name email role accountStatus createdAt -passwordHash');

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Error in getAllUsers admin controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Fetch User
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Prevent blocking admins
    if (targetUser.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot block another admin' });
    }

    // 3. Block User
    targetUser.accountStatus = 'blocked';
    await targetUser.save();
    
    // 4. Close active chats involving user
    await Chat.updateMany(
      { participants: userId, status: 'active' },
      { status: 'closed', closedAt: new Date() }
    );

    res.status(200).json({ success: true, message: 'User blocked and active chats closed', user: targetUser });
  } catch (error) {
    console.error('Error in blockUser admin controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteOrArchiveItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { action } = req.query; // 'delete' or 'archive', defaults to 'archive'

    // 1. Fetch Item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const performAction = action === 'delete' ? 'delete' : 'archive';

    // 2. Perform Action
    if (performAction === 'archive') {
      item.status = 'archived';
      item.archivedAt = new Date();
      await item.save();
      return res.status(200).json({ success: true, message: 'Item successfully archived', item });
    } else {
      await Item.findByIdAndDelete(itemId);
      return res.status(200).json({ success: true, message: 'Item successfully deleted permanently' });
    }

  } catch (error) {
    console.error('Error in deleteOrArchiveItem admin controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getSystemStats = async (req, res) => {
  try {
    // 1. Fetch aggregations using Promise.all parallel queries
    const [
      lostItems,
      foundItems,
      resolvedItems,
      activeItems,
      activeUsers,
      activeChats
    ] = await Promise.all([
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
      Item.countDocuments({ status: 'resolved' }),
      Item.countDocuments({ status: 'active' }),
      User.countDocuments({ accountStatus: 'active' }),
      Chat.countDocuments({ status: 'active' })
    ]);

    const stats = {
      lostItems,
      foundItems,
      resolvedItems,
      activeItems,
      activeUsers,
      activeChats
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Error in getSystemStats admin controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const triggerArchival = async (req, res) => {
  try {
    const count = await runArchivalNow();
    res.status(200).json({ success: true, message: `Manual archival completed. Archived ${count} items.` });
  } catch (error) {
    console.error('Error in triggerArchival admin controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

