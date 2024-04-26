const { Pool } = require('pg');
const config = require('../config');
const bcrypt = require('bcrypt');

const pool = new Pool(config.dbConfig);

const createUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query('INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *', [name, hashedPassword, email]);
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
    const result = await client.query('SELECT * FROM users WHERE name = $1', [req.user.name]);
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
    const { id, name, email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await client.query('UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1 RETURNING *', [id, name, email, hashedPassword]);
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