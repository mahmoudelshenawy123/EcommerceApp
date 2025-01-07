const fs = require('fs');
const path = require('path');

const Services = {};

const loadServicesFromDirectory = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadServicesFromDirectory(fullPath);
    } else if (file.endsWith('Services.js')) {
      const service = require(fullPath);
      const serviceName = file.replace('Services.js', '');
      Services[serviceName] = service;
    }
  });
};

const componentsPath = path.join(__dirname, '../components');
loadServicesFromDirectory(componentsPath);

module.exports.Services = Services;
