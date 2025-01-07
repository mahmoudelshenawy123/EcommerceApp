const { logger } = require('@src/config/logger');

const { Models } = require('@src/config/Models');
const { Services } = require('@src/config/Services');

const { ErrorHandler } = require('@src/helper/ErrorHandler');
const { ResponseSchema } = require('@src/helper/HelperFunctions');
const { LogInfo, LogError } = require('@src/helper/HelperFunctions');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email, password } = req.body;
    const image = req.file;

    LogInfo('--------- Start Add User -----------');
    const user = await Models.User.create({
      first_name,
      last_name,
      phone_number,
      email,
      password,
      image: image ? image.filename : null,
    });
    LogInfo('--------- End Add User -----------');
    return res
      .status(201)
      .json(ResponseSchema('User Added Successfully', true, user));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add User Due To: ${err} -------------`);
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
    const {
      first_name,
      last_name,
      phone_number,
      email,
      image: imageLink,
      password,
    } = req.body;
    const image = req.file;

    LogInfo('--------- Start Update User -----------');
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
    LogInfo('--------- End Update User -----------');
    return res
      .status(201)
      .json(ResponseSchema('User Updated Successfully', true, user));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Update User Due To: ${err} -------------`);
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
    LogInfo('--------- Start Login -----------');
    const user = await Models.User.scope('password').findOne({
      where: { email },
    });
    const comparePassword = await user?.comparePassword(password);
    if (comparePassword) {
      const token = await user?.generateJWTToken();
      LogInfo('--------- End Login -----------');
      return res
        .status(201)
        .json(ResponseSchema('User Logged Successfully', true, token));
    }
    LogInfo('--------- End Login -----------');
    return res.status(400).json(ResponseSchema(`Wrong Credentials`, false));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Login Due To: ${err} -------------`);
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
    LogInfo('--------- Start Get All Users -----------');
    const sendedObject = await Services?.Users?.getAllUsers(req);

    LogInfo('--------- End Get All Users Successfully -----------');
    return res.status(201).json(ResponseSchema('Users', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Users File Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getUser = async (req, res) => {
  try {
    LogInfo('--------- Start Get User -----------');
    const sendedObject = await Services?.Users?.getUser(req);
    LogInfo('--------- End Get User Successfully -----------');
    return res.status(201).json(ResponseSchema('User', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On User Due To: ${err} -------------`);
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
    LogInfo('--------- End Get All Users Successfully -----------');
    return res.status(201).json(ResponseSchema('Users', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Users File Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    LogInfo('--------- Start Delete User -----------');
    await Models.User.destroy({
      where: {
        id,
      },
    });
    LogInfo('--------- End Delete User -----------');
    return res
      .status(201)
      .json(ResponseSchema('User Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Delete User Due To: ${err} -------------`);
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
    LogInfo('--------- Start Add Story -----------');
    const story = await Services?.Users?.addStory(req);
    LogInfo('--------- End Add Story -----------');
    return res
      .status(201)
      .json(ResponseSchema('Story Added Successfully', true, story));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Story Due To: ${err} -------------`);
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
