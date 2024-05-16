const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token != null) {
    jwt.verify(token, config.accessTokenSecret, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

module.exports = { authenticateToken };