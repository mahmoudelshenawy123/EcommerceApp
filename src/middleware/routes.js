const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const routesPath = path.join(__dirname, '../components');

// Dynamically load all route files and add them to the router
fs.readdirSync(routesPath)
  .filter((folder) => fs.statSync(path.join(routesPath, folder)).isDirectory()) // Ensure it's a folder
  .forEach((folder) => {
    const routeFile = path.join(routesPath, folder, `${folder}Routes.js`);
    if (fs.existsSync(routeFile)) {
      const { route_name, router: route } = require(routeFile);
      if (route_name) {
        router.use(`/${route_name}`, route); // Prefix route path with the `route_name`
      }
    }
  });

module.exports = router;
