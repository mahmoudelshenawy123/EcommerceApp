const express = require('express');

const router = express.Router();
const multer = require('multer');
const ProvidersController = require('./ProvidersController');
const {
  validateRequest,
  ResponseSchema,
} = require('../../helper/HelperFunctions');
const ProvidersValidation = require('./ProvidersValidation');
const authJwt = require('../../middleware/auth');
const {
  checkisUserAdmin,
  checkisProvider,
} = require('../../middleware/authMiddlewares');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const savedFileName = `${file.fieldname}-provider-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

    cb(null, savedFileName);
  },
});

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
const uploadStory = multer({
  storage,
}).single('story_image');

function uploadModififedStoryImage(req, res, next) {
  uploadStory(req, res, (err) => {
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

router.post(
  '/login',
  multer().none(),
  validateRequest(ProvidersValidation?.loginProvider),
  ProvidersController?.loginProvider,
);

router.post(
  '/create-provider',
  uploadModififed,
  validateRequest(ProvidersValidation?.createProvider),
  ProvidersController?.createProvider,
);

router.use(authJwt());

router.put(
  '/update-provider',
  checkisProvider,
  uploadModififed,
  validateRequest(ProvidersValidation?.updateProvider),
  ProvidersController?.updateProvider,
);

router.post(
  '/add-story',
  checkisProvider,
  uploadModififedStoryImage,
  validateRequest(ProvidersValidation?.addStory),
  ProvidersController?.addStory,
);

router.get('/all-items', checkisUserAdmin, ProvidersController?.getAllItems);

router.get('/single-item', checkisProvider, ProvidersController?.getSingleItem);

router.get(
  '/all-items-with-pagination',
  checkisUserAdmin,
  ProvidersController?.getAllItemsWithPagination,
);

router.delete(
  '/delete-provider/:id',
  checkisUserAdmin,
  ProvidersController?.deleteProvider,
);

module.exports.router = router;
module.exports.route_name = 'providers';
