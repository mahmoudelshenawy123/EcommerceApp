const Joi = require('joi');
const { FileValidationSchema } = require('@src/helper/HelperFunctions');

module.exports.createUser = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  last_name: Joi.string().min(3).max(50).required(),
  phone_number: Joi.string().alphanum().required(),
  image: FileValidationSchema.required(),
  // images: Joi.object({
  //   image: Joi.array().items(FileValidationSchema).min(1).required(),
  //   images: Joi.array().items(FileValidationSchema).min(1).required(),
  // }),
  password: Joi.string().min(6).required(),
});

module.exports.updateUser = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  last_name: Joi.string().min(3).max(50).required(),
  phone_number: Joi.string().alphanum().required(),
  image: Joi.alternatives()
    .try(
      Joi.string(), // Accepts a string representation (e.g., a URL)
      FileValidationSchema, // Accepts a file object
    )
    .optional(),
  // images: Joi.object({
  //   image: Joi.array().items(FileValidationSchema).min(1).required(),
  //   images: Joi.array().items(FileValidationSchema).min(1).required(),
  // }),
  password: Joi.string().min(6).optional(),
});

module.exports.loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports.addStory = Joi.object({
  image: FileValidationSchema.required(),
  title: Joi.string().optional(),
});
