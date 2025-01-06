const Joi = require('joi');

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
    // Combine body and file for validation
    const imageObj = req.file ? { image: req.file } : {};
    const imagesObj = req.files ? { images: req.files } : {};
    const combinedData = {
      ...req.body,
      ...imageObj, // Add file to the validation data
      ...imagesObj, // Add files to the validation data
    };

    // Validate the combined data
    const { error } = schema.validate(combinedData, { abortEarly: false });
    if (error) {
      // Format the errors
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
const fileValidationSchema = Joi.object({
  destination: Joi.string().required(), // Ensure destination is a valid string
  encoding: Joi.string().valid('7bit', '8bit').required(), // Validate encoding
  fieldname: Joi.string().required(), // Fieldname should match your upload field (e.g., 'image')
  filename: Joi.string().required(), // Filename must be present
  mimetype: Joi.string().valid('image/png', 'image/jpeg').required(), // Allow only specific MIME types
  originalname: Joi.string().required(), // Ensure originalname is a valid string
  path: Joi.string().required(), // Path to uploaded file
  size: Joi.number()
    .max(1024 * 1024 * 5)
    .required(), // File size <= 5MB
});

module.exports = {
  fileValidationSchema,
  validateRequest,
  ResponseSchema,
  PaginateSchema,
  MergeImageLink,
  SplitImageLink,
};
