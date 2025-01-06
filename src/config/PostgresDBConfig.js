const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'movies',
  username: 'postgres',
  password: '123456',
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
});
const { logger } = require('./logger');

const PostgresDBConfig = () => {
  sequelize
    .authenticate()
    .then(() => {
      logger.info('Connected to Postgres...');
    })
    .catch((err) => {
      logger.error(
        `Could not connect to Postgres, exiting the application Due to: ${err}`,
      );
      process.exit();
    });
};

PostgresDBConfig();

module.exports = sequelize;
