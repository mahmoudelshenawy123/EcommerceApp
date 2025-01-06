const Joi = require('joi');
const { fileValidationSchema } = require('../../helper/HelperFunctions');

module.exports.createCategory = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  image: fileValidationSchema.required(),
});

module.exports.updateCategory = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  image: Joi.alternatives().try(Joi.string(), fileValidationSchema).optional(),
});
