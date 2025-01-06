const { User } = require('../componets/Users/UsersModel');
const { ResponseSchema } = require('../helper/HelperFunctions');

exports.checkUserStatus = async (req, res, next) => {
  const user = await User.findById({ phone_number: req.data?.phone_number });

  if (user?.status === 3) {
    return res.status(400).json(ResponseSchema('User is not active. Please contact admins', false));
  }
  res.locals.user = user;
  next();
};
