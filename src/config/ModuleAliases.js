const moduleAlias = require('module-alias');
const path = require('path');

moduleAlias.addAliases({
  '@src': path.join(__dirname, '/../'),
  '@': path.join(__dirname, '/'),
});
