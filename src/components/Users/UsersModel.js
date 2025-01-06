const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelizeDb = require('../../config/PostgresDBConfig');
const { MergeImageLink } = require('../../helper/HelperFunctions');

const User = sequelizeDb.define(
  'User',
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
    image: {
      type: DataTypes.STRING,
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

// User.sync()
//   .then(() => {
//     console.log('User table created');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

User.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};
User.prototype.comparePassword = function (comparedPassword) {
  const { password } = this;
  return bcrypt.compareSync(comparedPassword, password);
};
User.prototype.generateJWTToken = async function () {
  const token = jwt.sign(
    {
      user_id: this?.id,
      email: this?.email,
      type: 'user',
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
module.exports.User = User;
