// src/helper/errorHandler.js

const { default: mongoose } = require('mongoose');
const { logger } = require('../config/logger');
const { ResponseSchema } = require('./HelperFunctions');

const ErrorHandler = (err) => {
  const errors = [];
  if (err && err.message && err.message.includes('Validation error')) {
    Object.keys(err.errors).forEach((key) => {
      errors.push({ [key]: err.errors[key].message });
    });
  }
  if (err && err.code === 11000) {
    errors.push({ email: 'Email already exists' });
  }
  return errors;
};

const CheckValidIdObject = (req, res, id, message = '') => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json(ResponseSchema(message, false));
    return false;
  }
  return true;
};

// Error handler middleware for handling Mongoose validation errors
const mongooseErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    const message = `Validation Error: ${errors.join(', ')}`;
    logger.error(message); // Log the error
    return res.status(400).json({ error: message });
  }
  next(err); // Pass the error to the next middleware if it's not a validation error
};

// Error handler middleware for handling unhandled errors during development
const developmentErrorHandler = (req, res, err) => {
  logger.error(err?.stack); // Log the error stack
  res.status(err?.status || 500).json({ error: 'Internal Server Error' }); // Respond with the error message
};

// Error handler middleware for handling unhandled errors during production
const productionErrorHandler = (err, req, res) => {
  logger.error(err.message); // Log the error message
  res.status(err.status || 500).json({ error: 'Internal Server Error' }); // Respond with a generic error message
};

// Error handler middleware for handling not found errors
const notFoundErrorHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handling middleware to prevent app crashes
const globalErrorHandler = (err, req, res) => {
  logger.error(err.stack); // Log the error stack
  res.status(500).json({ error: 'Internal Server Error' }); // Respond with a generic error message
};

const checkAuthorization = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(ResponseSchema('Unauthorized', false));
  }
  next(err);
};

module.exports = {
  checkAuthorization,
  CheckValidIdObject,
  ErrorHandler,
  mongooseErrorHandler,
  developmentErrorHandler,
  productionErrorHandler,
  notFoundErrorHandler,
  globalErrorHandler, // Export the global error handler middleware
};
