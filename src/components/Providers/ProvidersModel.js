const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

const Providers = sequelizeDb.define(
  'Providers',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      required: true,
    },
    last_name: {
      type: DataTypes.STRING,
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
    password: {
      type: DataTypes.STRING,
      required: true,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, bcrypt.genSaltSync());
        return this.setDataValue('password', hashedPassword);
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      required: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      required: true,
    },
    current_latitude: {
      type: DataTypes.STRING,
      required: true,
    },
    current_longitude: {
      type: DataTypes.STRING,
      required: true,
    },
    access_token: {
      type: DataTypes.STRING(2048),
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
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      password: { attributes: {} }, // Use this scope to include password explicitly
    },
  },
);

// Providers.sync()
//   .then(() => {
//     console.log('Providers table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

Providers.prototype.getMainImageWithBaseUrl = function (req) {
  const { main_image } = this;
  return main_image ? MergeImageLink(req, main_image) : null;
};
Providers.prototype.getImagesWithBaseUrl = function (req) {
  const { images } = this;
  return images ? images?.map((image) => MergeImageLink(req, image)) : null;
};
Providers.prototype.comparePassword = function (comparedPassword) {
  const { password } = this;
  return bcrypt.compareSync(comparedPassword, password);
};
Providers.prototype.generateJWTToken = async function () {
  const token = jwt.sign(
    {
      user_id: this?.id,
      email: this?.email,
      type: 'providers',
    },
    process.env.JWT_SECRET,
    { expiresIn: '2d' },
  );
  Object.assign(this, {
    access_token: token,
  });
  await this.save();
  return token;
};
module.exports.Providers = Providers;
