const { DataTypes } = require('sequelize');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

const Products = sequelizeDb.define(
  'Products',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      required: true,
    },
    price: {
      type: DataTypes.DECIMAL,
      required: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      required: true,
    },
    main_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: 'created',
    freezeTableName: true,
  },
);

// Products.sync()
//   .then(() => {
//     console.log('Products table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

Products.prototype.getMainImageWithBaseUrl = function (req) {
  const { main_image } = this;
  return main_image ? MergeImageLink(req, main_image) : null;
};
Products.prototype.getImagesWithBaseUrl = function (req) {
  const { images } = this;
  return images ? images?.map((image) => MergeImageLink(req, image)) : null;
};

module.exports.Products = Products;
