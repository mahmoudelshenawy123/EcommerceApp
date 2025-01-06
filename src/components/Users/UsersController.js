const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');
const { Services } = require('../../config/Services');

const {
  ErrorHandler,
  // CheckValidIdObject,
} = require('../../helper/ErrorHandler');
const {
  ResponseSchema,
  PaginateSchema,
  // PaginateSchema,
} = require('../../helper/HelperFunctions');
// const UsersServices = require('./UsersServices');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, password } = req.body;
    const image = req.file;

    logger.info('--------- Start Add User -----------');
    const user = await Models.User.create({
      first_name,
      last_name,
      phone_number,
      email,
      password,
      image: image ? image.filename : null,
    });
    logger.info('--------- End Add User -----------');
    return res
      .status(201)
      .json(ResponseSchema('User Added Successfully', true, user));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Add User Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(
          `Somethings Went wrong Due To :${err.message}`,
          false,
          ErrorHandler(err),
        ),
      );
  }
};

exports.updateUser = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    // const authedUser = jwt.decode(token);
    const {
      first_name,
      last_name,
      phone_number,
      email,
      image: imageLink,
      password,
    } = req.body;
    const image = req.file;

    logger.info('--------- Start Update User -----------');
    const user = await Models.User.update(
      {
        first_name,
        last_name,
        phone_number,
        email,
        password,
        image: image ? image.filename : imageLink,
      },
      {
        where: {
          access_token: token,
        },
      },
    );
    logger.info('--------- End Update User -----------');
    return res
      .status(201)
      .json(ResponseSchema('User Updated Successfully', true, user));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Update User Due To: ${err} -------------`,
    );
    return res
      .status(400)
      .json(
        ResponseSchema(
          `Somethings Went wrong Due To :${err.message}`,
          false,
          ErrorHandler(err),
        ),
      );
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('--------- Start Login -----------');
    const user = await Models.User.scope('password').findOne({
      where: { email },
    });
    const comparePassword = await user?.comparePassword(password);
    if (comparePassword) {
      const token = await user?.generateJWTToken();
      logger.info('--------- End Login -----------');
      return res
        .status(201)
        .json(ResponseSchema('User Logged Successfully', true, token));
    }
    logger.info('--------- End Login -----------');
    return res.status(400).json(ResponseSchema(`Wrong Credentials`, false));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Login Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(
          `Somethings Went wrong Due To :${err.message}`,
          false,
          ErrorHandler(err),
        ),
      );
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const query = {};
    if (name) query.name = name;
    logger.info('--------- Start Get All Users -----------');
    const sendedObject = await Services?.Users?.getAllUsers(req);

    logger.info('--------- End Get All Users Successfully -----------');
    return res.status(201).json(ResponseSchema('Users', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Users File Due To: ${err} -------------`);
    return res.status(400).json(
      ResponseSchema(
        `Somethings Went wrong Due To :${err.message}`,
        false,
        // ErrorHandler(err),
      ),
    );
  }
};

exports.getUser = async (req, res) => {
  try {
    logger.info('--------- Start Get User -----------');
    const sendedObject = await Services?.Users?.getUser(req);
    logger.info('--------- End Get User Successfully -----------');
    return res.status(201).json(ResponseSchema('User', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On User Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getAllUsersWithPagination = async (req, res) => {
  try {
    const sendedObject = await Services?.Users?.getAllUsersWithPagination(req);
    logger.info('--------- End Get All Users Successfully -----------');
    return res.status(201).json(ResponseSchema('Users', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Users File Due To: ${err} -------------`);
    return res.status(400).json(
      ResponseSchema(
        `Somethings Went wrong Due To :${err.message}`,
        false,
        // ErrorHandler(err),
      ),
    );
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('--------- Start Delete User -----------');
    await Models.User.destroy({
      where: {
        id,
      },
    });
    logger.info('--------- End Delete User -----------');
    return res
      .status(201)
      .json(ResponseSchema('User Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Delete User Due To: ${err} -------------`,
    );
    return res
      .status(400)
      .json(
        ResponseSchema(
          `Somethings Went wrong Due To :${err.message}`,
          false,
          ErrorHandler(err),
        ),
      );
  }
};

exports.addStory = async (req, res) => {
  try {
    logger.info('--------- Start Add Story -----------');
    const story = await Services?.Users?.addStory(req);
    logger.info('--------- End Add Story -----------');
    return res
      .status(201)
      .json(ResponseSchema('Story Added Successfully', true, story));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Add Story Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(
          `Somethings Went wrong Due To :${err.message}`,
          false,
          ErrorHandler(err),
        ),
      );
  }
};
