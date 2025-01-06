const Joi = require('joi');
const { fileValidationSchema } = require('../../helper/HelperFunctions');

module.exports.createProvider = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  last_name: Joi.string().min(3).max(50).required(),
  phone_number: Joi.string().alphanum().required(),
  // image: fileValidationSchema.required(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  images: Joi.object({
    main_image: Joi.array().items(fileValidationSchema).min(1).required(),
    images: Joi.array().items(fileValidationSchema).min(1).required(),
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
  // image: Joi.alternatives()
  //   .try(
  //     Joi.string(), // Accepts a string representation (e.g., a URL)
  //     fileValidationSchema, // Accepts a file object
  //   )
  //   .optional(),
  // images: Joi.alternatives().try(
  //   Joi.array().items(Joi.string()).optional(), // Accepts an array of URLs
  //   Joi.array().items(fileValidationSchema).optional(), // Accepts an array of file objects
  // ),
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
  image: fileValidationSchema.required(),
  title: Joi.string().optional(),
});
