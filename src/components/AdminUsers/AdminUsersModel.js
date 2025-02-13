const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelizeDb = require('@src/config/PostgresDBConfig');
const { MergeImageLink } = require('@src/helper/HelperFunctions');

const AdminUsers = sequelizeDb.define(
  'AdminUsers',
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
      password: { attributes: {} },
    },
  },
);

AdminUsers.sync({ alter: true })
  .then(() => {
    console.log('AdminUsers table created');
  })
  .catch((err) => {
    console.log(err);
  });

AdminUsers.prototype.getImageWithBaseUrl = function (req) {
  const { image } = this;
  return image ? MergeImageLink(req, image) : null;
};
AdminUsers.prototype.comparePassword = function (comparedPassword) {
  const { password } = this;
  return bcrypt.compareSync(comparedPassword, password);
};
AdminUsers.prototype.generateJWTToken = async function () {
  const token = jwt.sign(
    {
      user_id: this?.id,
      email: this?.email,
      type: 'admin',
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
module.exports.AdminUsers = AdminUsers;
