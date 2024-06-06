const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Token = sequelize.define('Token', {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  access_token_expiry: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  refresh_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at', // Customize createdAt column name
  updatedAt: 'updated_at', // Customize updatedAt column name
  tableName: 'tokens',
});

module.exports = Token;
