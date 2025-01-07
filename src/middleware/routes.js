const fs = require('fs');
const path = require('path');
const express = require('express');

const router = express.Router();
const routesPath = path.join(__dirname, '../components');

fs.readdirSync(routesPath)
  .filter((folder) => fs.statSync(path.join(routesPath, folder)).isDirectory())
  .forEach((folder) => {
    const routeFile = path.join(routesPath, folder, `${folder}Routes.js`);
    if (fs.existsSync(routeFile)) {
      const { route_name, router: route } = require(routeFile);
      if (route_name) {
        router.use(`/${route_name}`, route);
      }
    }
  });

module.exports = router;
