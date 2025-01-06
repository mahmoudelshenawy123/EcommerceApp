const { DataTypes } = require('sequelize');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

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
// Stories.sync()
//   .then(() => {
//     console.log('Stories table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
Stories.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};
module.exports.Stories = Stories;
