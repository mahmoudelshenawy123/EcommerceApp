// src/helper/errorHandler.js

const { default: mongoose } = require('mongoose');
const { ResponseSchema, LogError } = require('./HelperFunctions');

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

// Error handler middleware for handling unhandled errors during production
const productionErrorHandler = (err, req, res) => {
  LogError(err.message); // Log the error message
  return res
    .status(err.status || 500)
    .json(ResponseSchema(`Internal Server Error`, false));
};

// Error handler middleware for handling not found errors
const notFoundErrorHandler = (req, res, next) => {
  // const error = new Error(`Not Found - ${req.originalUrl}`);
  return res
    .status(404)
    .json(ResponseSchema(`Not Found - ${req.originalUrl}`, false));
  // res.status(404);
  // next(error);
};

// Error handling middleware to prevent app crashes
const globalErrorHandler = (err, req, res) => {
  LogError(err.stack); // Log the error stack
  return res.status(500).json(ResponseSchema('Internal Server Error', false));
  // res.status(500).json({ error: 'Internal Server Error' }); // Respond with a generic error message
};

const checkAuthorization = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(ResponseSchema('Unauthorized', false));
  }
  next(err);
};

const developmentErrorHandler = (err, req, res, next) => {
  LogError(err.stack);
  return res.status(err.status || 500).json(
    ResponseSchema('Internal Server Error', false, {
      message: err.message,
      error: err,
    }),
  );
  // res.status(err.status || 500).json({
  //   message: err.message,
  //   error: err,
  // });
};

module.exports = {
  checkAuthorization,
  CheckValidIdObject,
  ErrorHandler,
  developmentErrorHandler,
  productionErrorHandler,
  notFoundErrorHandler,
  globalErrorHandler, // Export the global error handler middleware
};
