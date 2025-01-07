const Joi = require('joi');

// module.exports.createOrder = Joi.object({
//   order_latitude: Joi.string().required(),
//   order_longitude: Joi.string().required(),
//   user_id: Joi.string().required(),
//   price: Joi.number().positive().required(),
//   note: Joi.string().optional(),
//   provider_id: Joi.string().required(),
//   status: Joi.string()
//     .valid('pending', 'on_delivery', 'delivered', 'cancelled')
//     .required(),
//   payment_type: Joi.string().valid('cash').required(),
// });

module.exports.createOrder = Joi.object({
  order_latitude: Joi.string().required(),
  order_longitude: Joi.string().required(),
  user_id: Joi.string().required(),
  price: Joi.number().positive().required(),
  note: Joi.string().optional(),
  provider_id: Joi.string().required(),
  status: Joi.string()
    .valid('pending', 'on_delivery', 'delivered', 'cancelled')
    .required(),
  payment_type: Joi.string().valid('cash').required(),
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().integer().positive().required(),
      }),
    )
    .min(1)
    .required(),
});

module.exports.updateOrderStatus = Joi.object({
  status: Joi.string()
    .valid('pending', 'on_delivery', 'delivered', 'cancelled')
    .required(),
});
