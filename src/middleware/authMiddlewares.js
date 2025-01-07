const { ResponseSchema } = require('@src/helper/HelperFunctions');
const { Models } = require('@src/config/Models');

exports.checkisUserAdmin = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')?.[1];
  const admin = await Models.AdminUsers.findOne({
    where: {
      access_token: token,
    },
  });
  if (admin && admin?.status === 'active') {
    next();
  } else {
    return res.status(401).json(ResponseSchema('Unauthorized', false));
  }
};

exports.checkisUser = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')?.[1];
  const user = await Models.User.findOne({
    where: {
      access_token: token,
    },
  });
  if (user && user?.status === 'active') {
    next();
  } else {
    return res.status(401).json(ResponseSchema('Unauthorized', false));
  }
};

exports.checkisProvider = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')?.[1];
  const provider = await Models.Providers.findOne({
    where: {
      access_token: token,
    },
  });
  if (provider && provider?.status === 'active') {
    next();
  } else {
    return res.status(401).json(ResponseSchema('Unauthorized', false));
  }
};
