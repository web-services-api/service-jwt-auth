const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  Token.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
    }
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at', // Customize createdAt column name
    updatedAt: 'updated_at', // Customize updatedAt column name
    tableName: 'tokens',
  });
  return Token;
};