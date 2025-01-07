const { DataTypes } = require('sequelize');
const sequelizeDb = require('@src/config/PostgresDBConfig');
const { MergeImageLink } = require('@src/helper/HelperFunctions');

const ProvidersStories = sequelizeDb.define(
  'ProvidersStories',
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
ProvidersStories.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};
module.exports.ProvidersStories = ProvidersStories;
