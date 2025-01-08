const fs = require('fs');
const path = require('path');

const Models = {};

const loadModelsFromDirectory = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadModelsFromDirectory(fullPath);
    } else if (file.endsWith('Model.js')) {
      const model = require(fullPath);
      const modelName = Object.keys(model)[0];
      model[modelName]?.sync();
      Models[modelName] = model[modelName];
    }
  });
};

const componentsPath = path.join(__dirname, '../components');
loadModelsFromDirectory(componentsPath);

module.exports.Models = Models;
