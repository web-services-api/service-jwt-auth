const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at', // Customize createdAt column name
  updatedAt: 'updated_at', // Customize updatedAt column name
  tableName: 'roles',
});

module.exports = Role;
