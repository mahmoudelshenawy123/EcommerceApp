// const AdminUsersReltions = require('../components/AdminUsers/AdminUsersReltions');
// const UsersReltions = require('../components/Users/UsersReltions');

// module.exports = async (Models) => {
//   await UsersReltions(Models);
//   await AdminUsersReltions(Models);
// };
const fs = require('fs');
const path = require('path');
const sequelize = require('./PostgresDBConfig');

const Models = {};
const Relations = [];

// Recursive function to read models and relations from directories
const loadModelsAndRelations = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If the item is a directory, recursively load models and relations from it
      loadModelsAndRelations(fullPath);
    } else if (file.endsWith('Model.js')) {
      // If the file ends with 'Model.js', require it
      const model = require(fullPath);
      const modelName = Object.keys(model)[0];
      Models[modelName] = model[modelName];
    } else if (file.endsWith('Relations.js')) {
      // If the file ends with 'Reltions.js', require it as a relation
      const relation = require(fullPath);
      Relations.push(relation);
    }
  });
};

// Start loading models and relations from the 'components' folder
const componentsPath = path.join(__dirname, '../components');
loadModelsAndRelations(componentsPath);

module.exports = async () => {
  // Apply all relations dynamically
  for (const relation of Relations) {
    await relation(Models);
    // await sequelize.sync({ alter: true });
  }
};
