const Joi = require('joi');
const { logger } = require('@src/config/logger');

function PaginateSchema(currentPage, pages, count, data) {
  return {
    currentPage,
    pages,
    count,
    data,
  };
}
function ResponseSchema(message, status, data) {
  return {
    message,
    status,
    data,
  };
}
function MergeImageLink(req, imageLink) {
  const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`;
  return `${baseUrl}${imageLink}`;
}
function SplitImageLink(req, imageLink) {
  const baseUrl = `${req.protocol}://${req.get('host')}/public/uploads/`;
  return imageLink.split(baseUrl)[1];
}
const validateRequest = (schema) => {
  return (req, res, next) => {
    const imageObj = req.file ? { image: req.file } : {};
    const imagesObj = req.files ? { images: req.files } : {};
    const combinedData = {
      ...req.body,
      ...imageObj,
      ...imagesObj,
    };

    const { error } = schema.validate(combinedData, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      return res
        .status(400)
        .json(
          ResponseSchema(`Some fields are invalid or missing`, false, errors),
        );
    }

    next();
  };
};
// File validation schema
const FileValidationSchema = Joi.object({
  destination: Joi.string().required(),
  encoding: Joi.string().valid('7bit', '8bit').required(),
  fieldname: Joi.string().required(),
  filename: Joi.string().required(),
  mimetype: Joi.string().valid('image/png', 'image/jpeg').required(),
  originalname: Joi.string().required(),
  path: Joi.string().required(),
  size: Joi.number()
    .max(1024 * 1024 * 5)
    .required(),
});

const LogInfo = (message) =>
  logger.info(`------------ ${message} ------------`);

const LogError = (message) =>
  logger.error(`------------ ${message} ------------`);

const LogWarn = (message) =>
  logger.warn(`------------ ${message} ------------`);

module.exports = {
  FileValidationSchema,
  LogInfo,
  LogError,
  LogWarn,
  validateRequest,
  ResponseSchema,
  PaginateSchema,
  MergeImageLink,
  SplitImageLink,
};
