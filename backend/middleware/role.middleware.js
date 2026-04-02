export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || (req.user.role || '').toLowerCase() !== (role || '').toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
  };
};
