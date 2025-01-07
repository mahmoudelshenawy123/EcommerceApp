const express = require('express');

const router = express.Router();
const multer = require('multer');
const {
  validateRequest,
  ResponseSchema,
} = require('@src/helper/HelperFunctions');
const authJwt = require('@src/middleware/auth');
const { checkisUserAdmin } = require('@src/middleware/authMiddlewares');
const CategoriesController = require('./ProductsController');
const CategoriesValidation = require('./ProductsValidation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const savedFileName = `${file.fieldname}-product-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

    cb(null, savedFileName);
  },
});

const upload = multer({
  storage,
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'main_image', maxCount: 1 },
]);
function uploadModififed(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json(
        ResponseSchema(err?.message, false, {
          error: `invalid_file:${err}`,
        }),
      );
    }
    return next();
  });
}
router.use(authJwt());

router.post(
  '/create-product',
  checkisUserAdmin,
  uploadModififed,
  validateRequest(CategoriesValidation?.createProduct),
  CategoriesController?.createProduct,
);

router.put(
  '/update-product/:id',
  checkisUserAdmin,
  uploadModififed,
  validateRequest(CategoriesValidation?.updateProduct),
  CategoriesController?.updateProduct,
);

router.get('/all-items', CategoriesController?.getAllItems);

router.get('/single-product/:id', CategoriesController?.getProduct);

router.get(
  '/all-items-with-pagination',
  checkisUserAdmin,
  CategoriesController?.getAllItemsWithPagination,
);

router.delete(
  '/delete-product/:id',
  checkisUserAdmin,
  CategoriesController?.deleteProduct,
);

module.exports.router = router;
module.exports.route_name = 'products';
