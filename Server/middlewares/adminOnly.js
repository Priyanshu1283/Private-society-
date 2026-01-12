// Simple admin-only middleware
module.exports = (req, res, next) => {
  // auth middleware should have populated req.user
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};
