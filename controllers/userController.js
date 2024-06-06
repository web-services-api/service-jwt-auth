const bcrypt = require('bcrypt');
const Users = require('../models/users');
const Roles = require('../models/roles');

const createUser = async (req, res) => {
  try {
    const userRole = req.body.role;
    if (req.user) {
      const userID = req.user.userID;
      const user = await Users.findByPk(userID);

      if (userRole !== "ROLE_USER" && user.role !== "ROLE_ADMIN") {
        return res.status(403).json({ message: 'Unauthorized to create account with this role' });
      }
    } else {
      if (userRole !== "ROLE_USER"){
        return res.status(403).json({ message: 'You must be admin to create a user with this role' });
      }
    }

    const { name, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let roleId;
    if (role) {
      const roleData = await Roles.findOne({ where: { name: role } });
      if (!roleData) {
        return res.status(400).json({ message: 'Role not found' });
      }
      roleId = roleData.id;
    } else {
      const defaultRole = await Roles.findOne({ where: { name: 'ROLE_USER' } });
      roleId = defaultRole.id;
    }

    const newUser = await Users.create({
      name,
      password: hashedPassword,
      email,
      role_id: roleId
    });

    res.json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const getUser = async (req, res) => {
  try {
    const targetUser = await getTargetUser(req, res);
    if (targetUser) {
      res.json({
        id: targetUser.id,
        name: targetUser.name,
        role: targetUser.role,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt
      });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Error getting user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const targetUser = await getTargetUser(req, res);
    if (targetUser) {
      const { name, email, newPassword } = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      targetUser.name = name;
      targetUser.email = email;
      targetUser.password = hashedPassword;
      await targetUser.save();

      res.json({ message: 'User updated successfully', user: targetUser });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const getTargetUser = async (req, res) => {
  const targetUserId = req.params.id;
  const ownUserId = req.user.userID;

  const ownUser = await Users.findByPk(ownUserId);
  if (!ownUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (ownUser.role === 'ROLE_ADMIN' || ownUserId === targetUserId) {
    const targetUser = await Users.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User target not found' });
    }

    return targetUser;
  } else {
    res.status(403).json({ message: 'Unauthorized access' });
  }
};

module.exports = { createUser, getUser, updateUser };