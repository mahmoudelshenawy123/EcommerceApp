const { DataTypes } = require('sequelize');
const sequelizeDb = require('../../config/PostgresDBConfig');

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

// OrderProducts.sync()
//   .then(() => {
//     console.log('OrderProducts table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// OrderProducts.prototype.getMainImageWithBaseUrl = function (req) {
//   const { main_image } = this;
//   return main_image ? MergeImageLink(req, main_image) : null;
// };
// OrderProducts.prototype.getImagesWithBaseUrl = function (req) {
//   const { images } = this;
//   return images ? images?.map((image) => MergeImageLink(req, image)) : null;
// };

module.exports.OrderProducts = OrderProducts;
