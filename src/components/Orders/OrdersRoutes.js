const express = require('express');

const router = express.Router();
const multer = require('multer');
const OrdersController = require('./OrdersController');
const {
  validateRequest,
  ResponseSchema,
} = require('../../helper/HelperFunctions');
const OrdersValidation = require('./OrdersValidation');
const authJwt = require('../../middleware/auth');
const {
  checkisUserAdmin,
  checkisUser,
  checkisProvider,
} = require('../../middleware/authMiddlewares');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/uploads');
//   },
//   filename: (req, file, cb) => {
//     const savedFileName = `${file.fieldname}-product-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

//     cb(null, savedFileName);
//   },
// });

// const upload = multer({
//   storage,
// }).fields([
//   { name: 'images', maxCount: 6 },
//   { name: 'image', maxCount: 1 },
// ]);

// const upload = multer({
//   storage,
// }).fields([
//   { name: 'images', maxCount: 10 },
//   { name: 'main_image', maxCount: 1 },
// ]);
// const upload = multer({
//   storage,
// }).single('image');

// function uploadModififed(req, res, next) {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(400).json(
//         ResponseSchema(err?.message, false, {
//           error: `invalid_file:${err}`,
//         }),
//       );
//     }
//     return next();
//   });
// }
router.use(authJwt());

router.post(
  '/create-order',
  checkisUser,
  // uploadModififed,
  multer().none(),
  validateRequest(OrdersValidation?.createOrder),
  OrdersController?.createOrder,
);

router.put(
  '/update-order-stauts/:id',
  checkisProvider,
  // uploadModififed,
  multer().none(),
  validateRequest(OrdersValidation?.updateOrderStatus),
  OrdersController?.updateOrderStatus,
);

router.get('/all-items', OrdersController?.getAllItems);

router.get('/single-item/:id', OrdersController?.getSingleItem);

router.get(
  '/all-items-with-pagination',
  // checkisUserAdmin,
  OrdersController?.getAllItemsWithPagination,
);

router.delete(
  '/delete-order/:id',
  checkisUserAdmin,
  OrdersController?.deleteItem,
);

module.exports.router = router;
module.exports.route_name = 'orders';
