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

exports.createCategory = async (req, res) => {
  try {
    const { title, status } = req.body;
    const image = req.file;

    logger.info('--------- Start Add Category -----------');
    const category = await Models.Categories.create({
      title,
      status,
      image: image ? image.filename : null,
    });
    logger.info('--------- End Add Category -----------');
    return res
      .status(201)
      .json(ResponseSchema('Category Added Successfully', true, category));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Add Category Due To: ${err} -------------`,
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

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, image: imageLink } = req.body;
    const image = req.file;

    logger.info('--------- Start Update Category -----------');
    const category = await Models.Categories.update(
      {
        title,
        status,
        image: image ? image.filename : imageLink,
      },
      {
        where: { id },
      },
    );
    logger.info('--------- End Update Category -----------');
    return res
      .status(201)
      .json(ResponseSchema('Category Updated Successfully', true, category));
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

exports.getAllItems = async (req, res) => {
  try {
    logger.info('--------- Start Get All Categories -----------');
    const sendedObject = await Services?.Categories?.getAllItems(req);

    logger.info('--------- End Get All Categories Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Categories', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Categories File Due To: ${err} -------------`,
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

exports.getCategory = async (req, res) => {
  try {
    logger.info('--------- Start Get Category -----------');
    const sendedObject = await Services?.Categories?.getCategory(req);
    logger.info('--------- End Get Category Successfully -----------');
    return res.status(201).json(ResponseSchema('Category', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Category Due To: ${err} -------------`);
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
      await Services?.Categories?.getAllItemsWithPagination(req);
    logger.info('--------- End Get All Categories Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Categories', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Categories File Due To: ${err} -------------`,
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

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('--------- Start Delete Category -----------');
    await Models.Categories.destroy({
      where: {
        id,
      },
    });
    logger.info('--------- End Delete Category -----------');
    return res
      .status(201)
      .json(ResponseSchema('Category Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Delete Category Due To: ${err} -------------`,
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
