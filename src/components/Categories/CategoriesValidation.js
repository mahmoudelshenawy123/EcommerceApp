const Joi = require('joi');
const { FileValidationSchema } = require('@src/helper/HelperFunctions');

module.exports.createCategory = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  image: FileValidationSchema.required(),
});

module.exports.updateCategory = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  image: Joi.alternatives().try(Joi.string(), FileValidationSchema).optional(),
});
