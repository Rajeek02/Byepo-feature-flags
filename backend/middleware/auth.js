const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ message: 'Forbidden' });
      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { auth, requireRole };
   