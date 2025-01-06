const express = require('express');

const router = express.Router();
const multer = require('multer');
const CategoriesController = require('./ProductsController');
const {
  validateRequest,
  ResponseSchema,
} = require('../../helper/HelperFunctions');
const CategoriesValidation = require('./ProductsValidation');
const authJwt = require('../../middleware/auth');
const {
  checkisUserAdmin,
  checkisUser,
} = require('../../middleware/authMiddlewares');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const savedFileName = `${file.fieldname}-product-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

    cb(null, savedFileName);
  },
});

// const upload = multer({
//   storage,
// }).fields([
//   { name: 'images', maxCount: 6 },
//   { name: 'image', maxCount: 1 },
// ]);

const upload = multer({
  storage,
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'main_image', maxCount: 1 },
]);
// const upload = multer({
//   storage,
// }).single('image');

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
