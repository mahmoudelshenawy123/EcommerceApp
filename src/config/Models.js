const fs = require('fs');
const path = require('path');

const Models = {};

// Recursive function to read models from directories
const loadModelsFromDirectory = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If the item is a directory, recursively load models from it
      loadModelsFromDirectory(fullPath);
    } else if (file.endsWith('Model.js')) {
      // If the file ends with 'Model.js', require it
      const model = require(fullPath);
      const modelName = Object.keys(model)[0];
      Models[modelName] = model[modelName];
    }
  });
};

// Start loading models from the 'components' folder
const componentsPath = path.join(__dirname, '../components');
loadModelsFromDirectory(componentsPath);

module.exports.Models = Models;
