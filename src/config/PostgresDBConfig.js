const { Sequelize } = require('sequelize');
const { LogInfo, LogError } = require('@src/helper/HelperFunctions');
const { sql } = require('./Keys');

const sequelize = new Sequelize({
  database: sql?.database,
  username: sql?.username,
  password: sql?.password,
  host: sql?.host,
  dialect: 'postgres',
  logging: console.log,
});

const PostgresDBConfig = () => {
  sequelize
    .authenticate()
    .then(() => {
      LogInfo('Connected to Postgres...');
    })
    .catch((err) => {
      LogError(
        `Could not connect to Postgres, exiting the application Due to: ${err}`,
      );
      process.exit();
    });
};

PostgresDBConfig();

module.exports = sequelize;
