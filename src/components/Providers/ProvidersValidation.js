const Joi = require('joi');
const { FileValidationSchema } = require('@src/helper/HelperFunctions');

module.exports.createProvider = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  last_name: Joi.string().min(3).max(50).required(),
  phone_number: Joi.string().alphanum().required(),
  // image: FileValidationSchema.required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  images: Joi.object({
    main_image: Joi.array().items(FileValidationSchema).min(1).required(),
    images: Joi.array().items(FileValidationSchema).min(1).required(),
  }),
  password: Joi.string().min(6).required(),
  current_longitude: Joi.string().required(),
  current_latitude: Joi.string().required(),
});

module.exports.updateProvider = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  last_name: Joi.string().min(3).max(50).required(),
  phone_number: Joi.string().alphanum().required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  images: Joi.object({
    main_image: Joi.alternatives().try(
      Joi.array().items(Joi.string()).optional(),
      Joi.array().items(FileValidationSchema).optional(),
    ),
    images: Joi.alternatives().try(
      Joi.array().items(Joi.string()).optional(),
      Joi.array().items(FileValidationSchema).optional(),
    ),
  }),
  // .optional(),
  password: Joi.string().min(6).optional(),
  current_longitude: Joi.string().optional(),
  current_latitude: Joi.string().optional(),
});

module.exports.loginProvider = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports.addStory = Joi.object({
  image: FileValidationSchema.required(),
  title: Joi.string().optional(),
});
