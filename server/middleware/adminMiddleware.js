function hasAdminAccess(user) {
  const permissions = user.permissions || [];
  return (
    user.role === 'admin' ||
    permissions.includes('ALL_ACCESS') ||
    permissions.includes('ADMIN_ACCESS')
  );
}

function adminMiddleware(req, res, next) {
  if (!req.user || !hasAdminAccess(req.user)) {
    return res.status(403).json({ message: 'Access denied. Admin permission required.' });
  }

  next();
}

module.exports = adminMiddleware;
module.exports.hasAdminAccess = hasAdminAccess;
