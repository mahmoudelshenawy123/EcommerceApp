const { DataTypes } = require('sequelize');
const sequelizeDb = require('@src/config/PostgresDBConfig');
const { MergeImageLink } = require('@src/helper/HelperFunctions');

const Stories = sequelizeDb.define(
  'Stories',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        return this.getDataValue('image');
      },
    },
  },
  {
    timestamps: true,
    createdAt: 'created',
    freezeTableName: true,
  },
);
Stories.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};
module.exports.Stories = Stories;
