const Joi = require('joi');
const { fileValidationSchema } = require('../../helper/HelperFunctions');

module.exports.createProduct = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  provider_id: Joi.string().required(),
  category_id: Joi.string().required(),
  description: Joi.string().min(3).max(50).optional(),
  price: Joi.number().positive().required(),
  status: Joi.string().valid('active', 'inactive').required(),
  // image: fileValidationSchema.required(),
  images: Joi.object({
    main_image: Joi.array().items(fileValidationSchema).min(1).required(),
    images: Joi.array().items(fileValidationSchema).min(0).required(),
  }),
});

module.exports.updateProduct = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  category_id: Joi.string().required(),
  description: Joi.string().min(3).max(50).optional(),
  price: Joi.number().positive().required(),
  status: Joi.string().valid('active', 'inactive').required(),
  images: Joi.object({
    main_image: Joi.alternatives().try(
      Joi.array().items(Joi.string()).optional(), // Accepts an array of URLs
      Joi.array().items(fileValidationSchema).optional(), // Accepts an array of file objects
    ),
    images: Joi.alternatives().try(
      Joi.array().items(Joi.string()).optional(), // Accepts an array of URLs
      Joi.array().items(fileValidationSchema).optional(), // Accepts an array of file objects
    ),
  }),
});
