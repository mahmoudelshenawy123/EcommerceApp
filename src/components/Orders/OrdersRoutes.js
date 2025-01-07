const express = require('express');

const router = express.Router();
const multer = require('multer');
const {
  checkisUserAdmin,
  checkisUser,
  checkisProvider,
} = require('@src/middleware/authMiddlewares');

const { validateRequest } = require('@src/helper/HelperFunctions');
const authJwt = require('@src/middleware/auth');
const OrdersController = require('./OrdersController');
const OrdersValidation = require('./OrdersValidation');

router.use(authJwt());

router.post(
  '/create-order',
  checkisUser,
  multer().none(),
  validateRequest(OrdersValidation?.createOrder),
  OrdersController?.createOrder,
);

router.put(
  '/update-order-stauts/:id',
  checkisProvider,
  multer().none(),
  validateRequest(OrdersValidation?.updateOrderStatus),
  OrdersController?.updateOrderStatus,
);

router.get('/all-items', OrdersController?.getAllItems);

router.get('/single-item/:id', OrdersController?.getSingleItem);

router.get(
  '/all-items-with-pagination',
  OrdersController?.getAllItemsWithPagination,
);

router.delete(
  '/delete-order/:id',
  checkisUserAdmin,
  OrdersController?.deleteItem,
);

module.exports.router = router;
module.exports.route_name = 'orders';
