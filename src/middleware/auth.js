const { expressjwt: jwt } = require('express-jwt');
const { jwtSecretKey } = require('@src/config/Keys');

function authJwt() {
  const secret = jwtSecretKey;

  return jwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      { url: /\/public(.*)/ },
      '/users/create-user',
      '/users/login',
      '/admin/create-admin-users',
      '/admin/login',
    ],
  });
}

module.exports = authJwt;
