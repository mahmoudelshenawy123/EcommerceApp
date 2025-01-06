const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

const Categories = sequelizeDb.define(
  'Categories',
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
    image: {
      type: DataTypes.STRING,
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

// Categories.sync()
//   .then(() => {
//     console.log('Categories table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

Categories.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};

module.exports.Categories = Categories;
