const fs = require('fs');
const path = require('path');

const Services = {};

// Recursive function to read services from directories
const loadServicesFromDirectory = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If the item is a directory, recursively load services from it
      loadServicesFromDirectory(fullPath);
    } else if (file.endsWith('Services.js')) {
      // If the file ends with 'Service.js', require it
      const service = require(fullPath);
      const serviceName = file.replace('Services.js', '');
      Services[serviceName] = service;
    }
  });
};

// Start loading services from the 'components' folder
const componentsPath = path.join(__dirname, '../components');
loadServicesFromDirectory(componentsPath);

module.exports.Services = Services;
