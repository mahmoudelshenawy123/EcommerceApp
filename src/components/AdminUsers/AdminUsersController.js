const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');

const {
  ErrorHandler,
  // CheckValidIdObject,
} = require('../../helper/ErrorHandler');
const {
  ResponseSchema,
  PaginateSchema,
  // PaginateSchema,
} = require('../../helper/HelperFunctions');
const { Services } = require('../../config/Services');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, password } = req.body;
    const image = req.file;

    logger.info('--------- Start Add Admin User -----------');
    const user = await Models.AdminUsers.create({
      first_name,
      last_name,
      phone_number,
      email,
      password,
      image: image ? image.filename : null,
    });
    logger.info('--------- End Add Admin User -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User Added Successfully', true, user));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Add Admin User Due To: ${err} -------------`,
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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      phone_number,
      email,
      image: imageLink,
      password,
    } = req.body;
    const image = req.file;

    logger.info('--------- Start Update Admin User -----------');
    const user = await Models.AdminUsers.update(
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
          id,
        },
      },
    );
    logger.info('--------- End Update Admin User -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User Updated Successfully', true, user));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Update Admin User Due To: ${err} -------------`,
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
    const user = await Models.AdminUsers.scope('password').findOne({
      where: { email },
    });
    const comparePassword = await user?.comparePassword(password);
    if (comparePassword) {
      const token = await user?.generateJWTToken();
      logger.info('--------- End Login -----------');
      return res
        .status(201)
        .json(ResponseSchema('Admin User Logged Successfully', true, token));
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
    logger.info('--------- Start Get All Admin Users -----------');
    const sendedObject = await Services?.AdminUsers?.getAllUsers(req);

    logger.info('--------- End Get All Admin Users Successfully -----------');
    return res
      .status(201)
      .json(
        ResponseSchema('Admin Users Added Successfully', true, sendedObject),
      );
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Admin Users File Due To: ${err} -------------`,
    );
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
    logger.info('--------- Start Get Admin User -----------');
    const sendedObject = await Services?.AdminUsers?.getUser(req);
    logger.info('--------- End Get Admin User Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Admin User Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getAllUsersWithPagination = async (req, res) => {
  try {
    const sendedObject =
      await Services?.AdminUsers?.getAllUsersWithPagination(req);
    logger.info('--------- End Get All Admin Users Successfully -----------');
    return res
      .status(201)
      .json(
        ResponseSchema('Admin Users Added Successfully', true, sendedObject),
      );
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Admin Users File Due To: ${err} -------------`,
    );
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
    logger.info('--------- Start Delete Admin User -----------');
    await Models.AdminUsers.destroy({
      where: {
        id,
      },
    });
    logger.info('--------- End Delete Admin User -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Delete Admin User Due To: ${err} -------------`,
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
    const story = await Services?.AdminUsers?.addStory(req);
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
