const { LogInfo, LogError } = require('@src/helper/HelperFunctions');
const { Models } = require('@src/config/Models');
const { Services } = require('@src/config/Services');
const { ErrorHandler } = require('@src/helper/ErrorHandler');
const { ResponseSchema } = require('@src/helper/HelperFunctions');

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const image = req.file;

    LogInfo('--------- Start Add Admin User -----------');
    const user = await Models.AdminUsers.create({
      first_name,
      last_name,
      email,
      password,
      image: image ? image.filename : null,
    });
    LogInfo('--------- End Add Admin User -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User Added Successfully', true, user));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Admin User Due To: ${err} -------------`);
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
      email,
      image: imageLink,
      password,
    } = req.body;
    const image = req.file;

    LogInfo('--------- Start Update Admin User -----------');
    const user = await Models.AdminUsers.update(
      {
        first_name,
        last_name,
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
    LogInfo('--------- End Update Admin User -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User Updated Successfully', true, user));
  } catch (err) {
    console.log(err);
    LogError(
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
    LogInfo('--------- Start Login -----------');
    const user = await Models.AdminUsers.scope('password').findOne({
      where: { email },
    });
    const comparePassword = await user?.comparePassword(password);
    if (comparePassword) {
      const token = await user?.generateJWTToken();
      LogInfo('--------- End Login -----------');
      return res
        .status(201)
        .json(ResponseSchema('Admin User Logged Successfully', true, token));
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
    LogInfo('--------- Start Get All Admin Users -----------');
    const sendedObject = await Services?.AdminUsers?.getAllUsers(req);

    LogInfo('--------- End Get All Admin Users Successfully -----------');
    return res
      .status(201)
      .json(
        ResponseSchema('Admin Users Added Successfully', true, sendedObject),
      );
  } catch (err) {
    console.log(err);
    LogError(
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
    LogInfo('--------- Start Get Admin User -----------');
    const sendedObject = await Services?.AdminUsers?.getUser(req);
    LogInfo('--------- End Get Admin User Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Admin User Due To: ${err} -------------`);
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
    LogInfo('--------- End Get All Admin Users Successfully -----------');
    return res
      .status(201)
      .json(
        ResponseSchema('Admin Users Added Successfully', true, sendedObject),
      );
  } catch (err) {
    console.log(err);
    LogError(
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
    LogInfo('--------- Start Delete Admin User -----------');
    await Models.AdminUsers.destroy({
      where: {
        id,
      },
    });
    LogInfo('--------- End Delete Admin User -----------');
    return res
      .status(201)
      .json(ResponseSchema('Admin User Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    LogError(
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
