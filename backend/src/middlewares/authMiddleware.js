const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(403).json({ success: false, message: 'No token provided.' });
  }

  const token = bearerHeader.split(' ')[1]; // Format "Bearer <token>"
  if (!token) {
    return res.status(403).json({ success: false, message: 'Token missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized! Invalid token.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Require Admin Role!' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
