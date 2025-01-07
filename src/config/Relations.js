const fs = require('fs');
const path = require('path');

const Models = {};
const Relations = [];

const loadModelsAndRelations = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadModelsAndRelations(fullPath);
    } else if (file.endsWith('Model.js')) {
      const model = require(fullPath);
      const modelName = Object.keys(model)[0];
      Models[modelName] = model[modelName];
    } else if (file.endsWith('Relations.js')) {
      const relation = require(fullPath);
      Relations.push(relation);
    }
  });
};

const componentsPath = path.join(__dirname, '../components');
loadModelsAndRelations(componentsPath);

module.exports = async () => {
  for (const relation of Relations) {
    await relation(Models);
  }
};
