const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.dbConfig);

const createUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hashedPassword]);
    res.json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  } finally {
    client.release();
  }
};

const getUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [req.user.username]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Error getting user' });
  } finally {
    client.release();
  }
};

const updateUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { username } = req.user;
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await client.query('UPDATE users SET password = $1 WHERE username = $2 RETURNING *', [hashedPassword, username]);
    if (result.rows.length > 0) {
      res.json({ message: 'User updated successfully', user: result.rows[0] });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  } finally {
    client.release();
  }
};

module.exports = { createUser, getUser, updateUser };