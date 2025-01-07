const { DataTypes } = require('sequelize');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

const Orders = sequelizeDb.define(
  'Orders',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_longitude: {
      type: DataTypes.STRING,
      required: true,
    },
    order_latitude: {
      type: DataTypes.STRING,
      required: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      required: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'on_delivery', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    payment_type: {
      type: DataTypes.ENUM('cash'),
      defaultValue: 'cash',
    },
  },
  {
    timestamps: true,
    createdAt: 'created',
    freezeTableName: true,
  },
);

// Orders.sync()
//   .then(() => {
//     console.log('Orders table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

Orders.prototype.getMainImageWithBaseUrl = function (req) {
  const { main_image } = this;
  return main_image ? MergeImageLink(req, main_image) : null;
};
Orders.prototype.getImagesWithBaseUrl = function (req) {
  const { images } = this;
  return images ? images?.map((image) => MergeImageLink(req, image)) : null;
};

module.exports.Orders = Orders;
