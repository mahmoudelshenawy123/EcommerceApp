require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
require('../config/ModuleAliases');
const { LogInfo, LogError, LogWarn } = require('@src/helper/HelperFunctions');
const {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_FIRST_NAME,
  DEFAULT_ADMIN_LAST_NAME,
  DEFAULT_ADMIN_PASSWORD,
} = require('@src/constants/Constants');
const { Models } = require('../config/Models');

const addAdminUser = async () => {
  try {
    await Models.AdminUsers.sync();
    const adminUserCheck = await Models.AdminUsers.findOne({});

    if (!adminUserCheck) {
      await Models.AdminUsers.create({
        email: DEFAULT_ADMIN_EMAIL,
        first_name: DEFAULT_ADMIN_FIRST_NAME,
        last_name: DEFAULT_ADMIN_LAST_NAME,
        password: DEFAULT_ADMIN_PASSWORD,
      });
      LogInfo(`ADMIN USER ADDED`);
    } else {
      LogWarn(`ADMIN USER ALREADY ADDED`);
    }
  } catch (error) {
    LogError(`ERROR IN ADMIN USER ADDED SEEDING: ${error.message}`);
    throw error;
  }
};

const runSeeder = async () => {
  try {
    LogInfo(`ADMIN SEEDING STARTED`);
    await addAdminUser();
    LogInfo(`ADMIN SEEDING DONE`);
  } catch (error) {
    LogError(`'ERROR IN SEEDING:', error.message`);
  } finally {
    LogInfo(`SEEDING COMPLETE`);
    process.exit();
  }
};

runSeeder();
