require('./src/config/ModuleAliases');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const errorHandlers = require('@src/helper/ErrorHandler');
const Relations = require('@src/config/Relations');
const { Models } = require('@src/config/Models');
const routes = require('@src/middleware/routes');
const { port, env } = require('@src/config/Keys');
const { LogInfo } = require('@src/helper/HelperFunctions');

const app = express();

// Connect to the database
setTimeout(() => {
  Relations(Models);
}, 0);

// Middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

app.use(errorHandlers.checkAuthorization);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Routes
app.use('/api', routes);

if (env === 'DEVELOPMENT') {
  app.use(errorHandlers.developmentErrorHandler);
} else {
  app.use(errorHandlers.productionErrorHandler);
}
app.use(errorHandlers.notFoundErrorHandler);

app.use(errorHandlers.globalErrorHandler);

// Start the server
const PORT = port || 3000;
app.listen(PORT, () => {
  LogInfo(`Server running at http://localhost:${PORT}`);
});
