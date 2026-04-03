import Item from '../models/Item.model.js';
import User from '../models/User.model.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Fetch User details (fresh from DB)
    const user = await User.findById(userId).select('-passwordHash');
    
    // 2. Calculate Stats
    const totalReports = await Item.countDocuments({ reportedBy: userId });
    const rawResolved  = await Item.countDocuments({ reportedBy: userId, status: 'resolved' });
    // Each resolution marks 2 items (lost + found). Halve to get true count.
    const resolvedReports = Math.floor(rawResolved / 2);

    // Match rate: resolved resolutions vs total reports filed
    const matchRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalReports,
        resolvedReports,
        matchRate: `${matchRate}%`
      }
    });
  } catch (error) {
    console.error('Error in getProfile controller:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
