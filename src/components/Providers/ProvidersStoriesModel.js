const { DataTypes } = require('sequelize');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

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
// ProvidersStories.sync()
//   .then(() => {
//     console.log('ProvidersStories table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
ProvidersStories.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};
module.exports.ProvidersStories = ProvidersStories;
