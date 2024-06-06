const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const Users = require('../models/users');
const Token = require('../models/token');

const generateAccessToken = (name, userID) => {
  return jwt.sign({ name, userID }, config.accessTokenSecret, { expiresIn: '60m' });
};

const generateRefreshToken = (name, userID) => {
  return jwt.sign({ name, userID }, config.refreshTokenSecret, { expiresIn: '120m' });
};

const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await Users.findOne({ where: { name } });

    if (user) {
      const hash = user.password.replace(/^\$2y(.+)$/i, '$2a$1');
      const passwordMatch = await bcrypt.compare(password, hash);
      if (passwordMatch) {
        await Token.destroy({ where: { user_id: user.id } });

        const accessToken = generateAccessToken(name, user.id);
        const refreshToken = generateRefreshToken(name, user.id);

        await Token.create({
          user_id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          access_token_expiry: new Date(Date.now() + 60 * 60 * 1000),
          refresh_token_expiry: new Date(Date.now() + 120 * 60 * 1000),
        });

        res.json({ accessToken, refreshToken });
      } else {
        res.status(401).json({ message: 'Invalid name or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid name or password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Error authenticating user' });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.params.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const tokenData = await Token.findOne({ where: { refresh_token: refreshToken } });
    if (!tokenData) return res.sendStatus(403);

    jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = generateAccessToken(user.name, user.id);
      const refreshToken = generateRefreshToken(user.name, user.id);

      tokenData.access_token = accessToken;
      tokenData.refresh_token = refreshToken;
      tokenData.access_token_expiry = new Date(Date.now() + 60 * 60 * 1000);
      tokenData.refresh_token_expiry = new Date(Date.now() + 120 * 60 * 1000);
      tokenData.save();

      res.json({ accessToken, accessTokenExpiresAt : tokenData.access_token_expiry, refreshToken, refreshTokenExpiresAt : tokenData.refresh_token_expiry });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
};

const validateAccessToken = (req, res) => {
  const accessToken = req.params.accessToken;
  console.log(req.body)
  if (!accessToken) return res.sendStatus(401);

  jwt.verify(accessToken, config.accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    } else {
      const issuedAt = new Date(decoded.iat * 1000); // Convert UNIX timestamp to milliseconds
      const expiresAt = new Date(decoded.exp * 1000);
      res.status(200).json({
        accessToken,
        accessTokenCreatedAt: issuedAt.toLocaleString(), // Convert to human-readable date format
        accessTokenExpiresAt: expiresAt.toLocaleString(),
      });
    }
  });
};

module.exports = { login, refreshToken, validateAccessToken };