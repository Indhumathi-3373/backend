function extractScopes(req) {
  const user = req.session?.user;
  if (!user) return [];
  if (Array.isArray(user.scopes)) return user.scopes;
  if (typeof user.scope === 'string') return [user.scope];
  return [];
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }
  const scopes = extractScopes(req);
  if (!scopes.includes('admin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = {
  requireAdmin
};
