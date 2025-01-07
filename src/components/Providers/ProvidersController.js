const { Op } = require('sequelize');
const { LogInfo, LogError } = require('@src/helper/HelperFunctions');

const { Models } = require('@src/config/Models');
const { Services } = require('@src/config/Services');

const { ErrorHandler } = require('@src/helper/ErrorHandler');
const { ResponseSchema } = require('@src/helper/HelperFunctions');

exports.createProvider = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      current_latitude,
      current_longitude,
      categories,
    } = req.body;
    const { main_image, images } = req.files;

    LogInfo('--------- Start Add Provider -----------');
    const provider = await Models.Providers.create({
      first_name,
      last_name,
      phone_number,
      email,
      password,
      current_latitude,
      current_longitude,
      images: images?.map((image) => image?.filename),
      main_image: main_image ? main_image?.[0]?.filename : null,
    });
    const query = {
      id: {
        [Op.in]: categories,
      },
    };
    const categoriesItems = await Models.Categories.findAll({
      where: query,
    });
    await provider.addCategories(categoriesItems);
    LogInfo('--------- End Add Provider -----------');
    return res
      .status(201)
      .json(ResponseSchema('Provider Added Successfully', true, provider));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Provider Due To: ${err} -------------`);
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

exports.updateProvider = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    const {
      first_name,
      last_name,
      phone_number,
      email,
      image: imageLink,
      password,
      current_latitude,
      current_longitude,
    } = req.body;
    const image = req.file;

    LogInfo('--------- Start Update Provider -----------');
    const provider = await Models.Providers.update(
      {
        first_name,
        last_name,
        phone_number,
        email,
        password,
        current_latitude,
        current_longitude,
        image: image ? image.filename : imageLink,
      },
      {
        where: {
          access_token: token,
        },
      },
    );
    LogInfo('--------- End Update Provider -----------');
    return res
      .status(201)
      .json(ResponseSchema('Provider Updated Successfully', true, provider));
  } catch (err) {
    console.log(err);
    LogError(
      `---------- Error On Update Provider Due To: ${err} -------------`,
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

exports.loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;
    LogInfo('--------- Start Login -----------');
    const provider = await Models.Providers.scope('password').findOne({
      where: { email },
    });
    const comparePassword = await provider?.comparePassword(password);
    if (comparePassword) {
      const token = await provider?.generateJWTToken();
      LogInfo('--------- End Login -----------');
      return res
        .status(201)
        .json(ResponseSchema('Provider Logged Successfully', true, token));
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

exports.getAllItems = async (req, res) => {
  try {
    const { name } = req.query;
    const query = {};
    if (name) query.name = name;
    LogInfo('--------- Start Get All Providers -----------');
    const sendedObject = await Services?.Providers?.getAllItems(req);

    LogInfo('--------- End Get All Providers Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Providers', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Providers File Due To: ${err} -------------`);
    return res.status(400).json(
      ResponseSchema(
        `Somethings Went wrong Due To :${err.message}`,
        false,
        // ErrorHandler(err),
      ),
    );
  }
};

exports.getSingleItem = async (req, res) => {
  try {
    LogInfo('--------- Start Get Provider -----------');
    const sendedObject = await Services?.Providers?.getSingleItem(req);
    LogInfo('--------- End Get Provider Successfully -----------');
    return res.status(201).json(ResponseSchema('Provider', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Provider Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getAllItemsWithPagination = async (req, res) => {
  try {
    const sendedObject =
      await Services?.Providers?.getAllItemsWithPagination(req);
    LogInfo('--------- End Get All Provider Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Providers', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Providers File Due To: ${err} -------------`);
    return res.status(400).json(
      ResponseSchema(
        `Somethings Went wrong Due To :${err.message}`,
        false,
        // ErrorHandler(err),
      ),
    );
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    LogInfo('--------- Start Delete Provider -----------');
    await Models.Providers.destroy({
      where: {
        id,
      },
    });
    LogInfo('--------- End Delete Provider -----------');
    return res
      .status(201)
      .json(ResponseSchema('Provider Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    LogError(
      `---------- Error On Delete Provider Due To: ${err} -------------`,
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
    LogInfo('--------- Start Add Story -----------');
    const story = await Services?.Providers?.addStory(req);
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
