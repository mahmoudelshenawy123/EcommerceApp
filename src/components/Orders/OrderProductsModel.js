const { DataTypes } = require('sequelize');
const sequelizeDb = require('@src/config/PostgresDBConfig');

const OrderProducts = sequelizeDb.define(
  'OrderProducts',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
    createdAt: 'created',
    freezeTableName: true,
  },
);

module.exports.OrderProducts = OrderProducts;
