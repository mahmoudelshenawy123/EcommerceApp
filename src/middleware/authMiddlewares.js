const jwt = require('jsonwebtoken');
const { ResponseSchema } = require('../helper/HelperFunctions');
const { Models } = require('../config/Models');

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

// exports.checkisUserActive = async (req, res, next) => {
// //   const token = req?.headers?.authorization?.split(' ')?.[1];
// //   const authedUser = jwt.decode(token);
// //   if (authedUser?.user_type == 'admin') {
// //     let admin = await GetAdminUserById(authedUser?.user_id);
// //     console.log(admin);
// //     if (admin?.status == 1) {
// //       next();
// //       return;
// //     }
// //   } else if (authedUser?.user_type == 'user') {
// //     let user = await GetUserById(authedUser?.user_id);
// //     if (user?.status == 1) {
// //       next();
// //       return;
// //     }
// //   }
// //   // else if(authedUser?.user_type=='provider'){
// //   //     let provider = await GetProviderById(authedUser?.user_id)
// //   //     if(provider?.status ==1){
// //   //         next()
// //   //         return
// //   //     }
// //   // }
// //   return res
// //     .status(401)
// //     .json(
// //       ResponseSchema(
// //         'User Is Not Active. Please Contact Admin To Activate it',
// //         false,
// //       ),
// //     );
// // };
