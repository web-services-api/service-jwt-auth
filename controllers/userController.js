const { Pool } = require('pg');
const config = require('../config');
const bcrypt = require('bcrypt');
const pool = new Pool(config.dbConfig);

const createUser = async (req, res) => {
  try {
    if (req.user) {
      const client = await pool.connect();
      const userRole = req.body.role_id;
      const userID = req.user.name.userID;
      let user = await client.query('SELECT * FROM users WHERE id = $1', [userID]);
      if (userRole != 1 && user.rows[0].role_id != 2) {
        return res.status(403).json({ message: 'Unauthorized to create account with this role' });
      }
    } else {
      if (req.body.role_id !== 1) {
        return res.status(403).json({ message: 'Unauthorized to create account with this role' });
      }
    }

    // Proceed with account creation
    const { name, password, email, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (name, password, email, role_id) VALUES ($1, $2, $3, $4) RETURNING *', [name, hashedPassword, email, role_id]);
    res.json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const getUser = async (req, res) => {
  const client = await pool.connect();
  try {
    let targetUser = await getTargetUser(req, res);
    if (targetUser) {
      let targetRole = targetUser.roles;
      res.json({ id: targetUser.id, name: targetUser.name, role: targetRole.name, createdAt: targetRole.createdAt, updatedAt: targetRole.updatedAt });
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
    let targetUser = await getTargetUser(req, res);
    if (targetUser) {
      const userID = targetUser.id;
      const { name, email, newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await client.query('UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1 RETURNING *', [userID, name, email, hashedPassword]);
      if (result.rows.length > 0) {
        res.json({ message: 'User updated successfully', user: result.rows[0] });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  } finally {
    client.release();
  }
};

const getTargetUser = async (req, res) => {
  const client = await pool.connect();
  const targetUserId = req.params.id;
  const ownUserId = req.user.name.userID;

  let ownUser = await client.query('SELECT * FROM users WHERE id = $1', [ownUserId]);
  ownUser = ownUser.rows[0];
  if (!ownUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  let ownRole = await client.query('SELECT * FROM roles WHERE id = $1', [ownUser.role_id]);
  ownRole = ownRole.rows[0];
  if (!ownRole) {
    return res.status(500).json({ message: 'Role not found for the user' });
  }

  if (ownRole.name === 'ROLE_ADMIN' || ownUserId === targetUserId) {
    let targetUser = await client.query('SELECT * FROM users WHERE id = $1', [targetUserId]);
    targetUser = targetUser.rows[0];
    if (!targetUser) {
      return res.status(404).json({ message: 'User target not found' });
    }

    let targetRole = await client.query('SELECT * FROM roles WHERE id = $1', [targetUser.role_id]);
    targetRole = targetRole.rows[0];
    if (!targetRole) {
      return res.status(500).json({ message: 'Role target not found for the user' });
    }
    targetUser.roles = targetRole;
    return targetUser;
  } else {
    res.status(403).json({ message: 'Unauthorized access' });
  }
}

const checkUserPerm = async (req, res) => {
  console.log(req.user)

}

module.exports = { createUser, getUser, updateUser };