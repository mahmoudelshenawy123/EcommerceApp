const express = require('express');

const router = express.Router();
const multer = require('multer');
const AdminUsersController = require('./AdminUsersController');
const {
  validateRequest,
  ResponseSchema,
} = require('../../helper/HelperFunctions');
const AdminUsersValidation = require('./AdminUsersValidation');
const authJwt = require('../../middleware/auth');
const { checkisUserAdmin } = require('../../middleware/authMiddlewares');

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
  validateRequest(AdminUsersValidation?.loginUser),
  AdminUsersController?.loginUser,
);

router.use(authJwt());

router.post(
  '/create-admin-user',
  checkisUserAdmin,
  uploadModififed,
  validateRequest(AdminUsersValidation?.createUser),
  AdminUsersController?.createUser,
);
router.put(
  '/update-admin-user/:id',
  checkisUserAdmin,
  uploadModififed,
  validateRequest(AdminUsersValidation?.updateUser),
  AdminUsersController?.updateUser,
);

router.get(
  '/all-admin-users',
  checkisUserAdmin,
  AdminUsersController?.getAllUsers,
);

router.get(
  '/single-admin-user',
  checkisUserAdmin,
  AdminUsersController?.getUser,
);

router.get(
  '/all-admin-users-with-pagination',
  checkisUserAdmin,
  AdminUsersController?.getAllUsersWithPagination,
);

router.delete(
  '/delete-admin-user/:id',
  checkisUserAdmin,
  AdminUsersController?.deleteUser,
);

module.exports.router = router;
module.exports.route_name = 'admin';
