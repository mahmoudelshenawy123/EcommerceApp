const express = require('express');

const router = express.Router();
const multer = require('multer');
const UsersController = require('./UsersController');
const {
  validateRequest,
  ResponseSchema,
} = require('../../helper/HelperFunctions');
const UsersValidation = require('./UsersValidation');
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
    const savedFileName = `${file.fieldname}-user-${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

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
  validateRequest(UsersValidation?.loginUser),
  UsersController?.loginUser,
);

router.post(
  '/create-user',
  uploadModififed,
  validateRequest(UsersValidation?.createUser),
  UsersController?.createUser,
);

router.use(authJwt());

router.put(
  '/update-user',
  checkisUser,
  uploadModififed,
  validateRequest(UsersValidation?.updateUser),
  UsersController?.updateUser,
);

router.post(
  '/add-story',
  checkisUser,
  uploadModififedStoryImage,
  validateRequest(UsersValidation?.addStory),
  UsersController?.addStory,
);

router.get('/all-users', checkisUserAdmin, UsersController?.getAllUsers);

router.get('/single-user', checkisUser, UsersController?.getUser);

router.get(
  '/all-users-with-pagination',
  checkisUserAdmin,
  UsersController?.getAllUsersWithPagination,
);

router.delete(
  '/delete-user/:id',
  checkisUserAdmin,
  UsersController?.deleteUser,
);

module.exports.router = router;
module.exports.route_name = 'users';
