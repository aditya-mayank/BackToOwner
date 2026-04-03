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
    console.log('[Admin Service] Fetching all campus users...');
    const users = await User.find().select('_id name email role accountStatus roll createdAt lastLoginAt').sort({ createdAt: -1 });
    console.log(`[Admin Service] Successfully retrieved ${users.length} users.`);
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('[Admin Service ERROR] getAllUsers failed:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // Optional: specify 'active' or 'blocked'

    // 1. Fetch User
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 2. Prevent modifying other admins
    if (targetUser.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot modify another admin account' });
    }

    // 3. Update Status
    const newStatus = status || (targetUser.accountStatus === 'active' ? 'blocked' : 'active');
    targetUser.accountStatus = newStatus;
    await targetUser.save();
    
    // 4. If blocking, close active chats
    if (newStatus === 'blocked') {
      await Chat.updateMany(
        { participants: userId, status: 'active' },
        { status: 'closed', closedAt: new Date() }
      );
    }

    res.status(200).json({ 
      success: true, 
      message: `User account status updated to ${newStatus}`, 
      user: targetUser 
    });
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
    console.log('[Admin Service] Aggregating system statistics...');
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

    // Each resolved chat marks 2 items (lost + found) as resolved.
    // Divide by 2 to get the true number of successful resolutions.
    const trueResolved = Math.floor(resolvedItems / 2);

    const stats = {
      lostItems,
      foundItems,
      resolvedItems: trueResolved,
      activeItems,
      activeUsers,
      activeChats
    };
    console.log(`[Admin Service] Compilation successful. Tracking ${trueResolved} resolved student items (${resolvedItems} raw / 2).`);
    console.log('[Admin Service] Stats generated:', stats);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('[Admin Service ERROR] getSystemStats failed:', error);
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

