const jwt = require('jsonwebtoken');

// Verifies the Bearer token and attaches { id, role } to req.user
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not logged in' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session, please log in again' });
  }
}

// Restricts a route to a specific role ('farmer' or 'worker'). Use after requireAuth.
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Only ${role} accounts can do this` });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
