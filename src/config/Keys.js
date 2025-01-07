module.exports = {
  env: process.env.ENV,
  port: process.env.PORT,
  jwtSecretKey:
    process.env.JWT_SECRET || 'hahtesgsdfsd312321312123kljlhwjsdfsdf',
  sql: {
    database: process.env.SQL_DATABASE,
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    host: process.env.SQL_HOST,
  },
};
