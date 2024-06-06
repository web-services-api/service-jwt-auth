const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  remember_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at', // Customize createdAt column name
  updatedAt: 'updated_at', // Customize updatedAt column name
  tableName: 'users',
});

module.exports = User;