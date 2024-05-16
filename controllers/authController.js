const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.dbConfig);

const generateAccessToken = (name, userID) => {
  return jwt.sign({ name, userID }, config.accessTokenSecret, { expiresIn: '60m' });
};

const generateRefreshToken = (name, userID) => {
  return jwt.sign({ name, userID }, config.refreshTokenSecret, { expiresIn: '120m' });
};

const login = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, password } = req.body;
    const result = await client.query('SELECT * FROM users WHERE name = $1', [name]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        let userID = user.id;
        await client.query('DELETE FROM tokens WHERE user_id = $1', [userID]);

        const accessToken = generateAccessToken({ name, userID });
        const refreshToken = generateRefreshToken({ name, userID });
        const insertQuery = `
        INSERT INTO tokens (user_id, access_token, refresh_token, access_token_expiry, refresh_token_expiry, created_at, updated_at)
        VALUES ($1, $2, $3, current_timestamp + INTERVAL '30 MINUTES', current_timestamp + INTERVAL '1 HOUR', current_timestamp, current_timestamp)
        RETURNING *;        
        `;
        const insertValues = [user.id, accessToken, refreshToken];
        const insertResult = await client.query(insertQuery, insertValues);

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
  } finally {
    client.release();
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.params.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user.name, user.id);
    const refreshToken = generateRefreshToken(user.name, user.id);
    const accessTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes
    const refreshTokenExpiresAt = new Date(Date.now() + 120 * 60 * 1000); // 120 minutes
    res.json({ accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt });
  });
};

const validateAccessToken = (req, res) => {
  const accessToken = req.params.accessToken;
  if (!accessToken) return res.sendStatus(401);
  jwt.verify(accessToken, config.accessTokenSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired access token' });
    } else {
      const issuedAt = new Date(decoded.iat * 1000); // Convert UNIX timestamp to milliseconds
      const expiresAt = new Date(decoded.exp * 1000);
      res.status(200).json({
        accessToken: accessToken,
        accessTokenCreatedAt: issuedAt.toLocaleString(), // Convert to human-readable date format
        accessTokenExpiresAt: expiresAt.toLocaleString(),
      });
    }
  });
};

module.exports = { login, refreshToken, validateAccessToken };