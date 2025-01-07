const express = require('express');

const router = express.Router();
const multer = require('multer');
const {
  validateRequest,
  ResponseSchema,
} = require('@src/helper/HelperFunctions');
const authJwt = require('@src/middleware/auth');
const { checkisUserAdmin } = require('@src/middleware/authMiddlewares');
const CategoriesController = require('./CategoriesController');
const CategoriesValidation = require('./CategoriesValidation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const savedFileName = `${file.fieldname}-category-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
    cb(null, savedFileName);
  },
});

const upload = multer({
  storage,
}).single('image');

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
  '/create-category',
  checkisUserAdmin,
  uploadModififed,
  validateRequest(CategoriesValidation?.createCategory),
  CategoriesController?.createCategory,
);

router.put(
  '/update-category/:id',
  checkisUserAdmin,
  uploadModififed,
  validateRequest(CategoriesValidation?.updateCategory),
  CategoriesController?.updateCategory,
);

router.get('/all-items', CategoriesController?.getAllItems);

router.get('/single-category/:id', CategoriesController?.getCategory);

router.get(
  '/all-items-with-pagination',
  checkisUserAdmin,
  CategoriesController?.getAllItemsWithPagination,
);

router.delete(
  '/delete-category/:id',
  checkisUserAdmin,
  CategoriesController?.deleteCategory,
);

module.exports.router = router;
module.exports.route_name = 'categories';
