// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

const { logger } = require('./src/config/logger');
const errorHandlers = require('./src/helper/ErrorHandler');
// const UsersRoutes = require('./src/components/Users/UsersRoutes');
const Relations = require('./src/config/Relations');
const { Models } = require('./src/config/Models');
// const { Services } = require('./src/config/Services');
// const authJwt = require('./src/middleware/auth');
const routes = require('./src/middleware/routes');

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

// Error Handlers
// app.use(errorHandlers.mongooseErrorHandler);
if (process.env.ENV === 'DEVELOPMENT') {
  app.use(errorHandlers.developmentErrorHandler);
} else {
  app.use(errorHandlers.productionErrorHandler);
}
app.use(errorHandlers.notFoundErrorHandler);

// // Global Error Handler
// app.use(errorHandlers.globalErrorHandler);

// Start the server
const PORT = process.env.PORT || 3000; // Default port is 3000 if not specified in .env
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
