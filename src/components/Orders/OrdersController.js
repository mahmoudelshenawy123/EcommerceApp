const { Sequelize } = require('sequelize');
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

exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      order_latitude,
      order_longitude,
      price,
      provider_id,
      status,
      note,
      payment_type,
      products = [],
    } = req.body;

    logger.info('--------- Start Add Order -----------');
    const order = await Models.Orders.create({
      user_id,
      order_latitude,
      order_longitude,
      note,
      payment_type,
      status,
      price,
      provider_id,
    });
    for (const productItem of products) {
      await order.addProduct(productItem?.id, {
        through: { quantity: productItem?.quantity },
      });
    }
    logger.info('--------- End Add Order -----------');
    return res
      .status(201)
      .json(ResponseSchema('Order Added Successfully', true, order));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Add Order Due To: ${err} -------------`);
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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    logger.info('--------- Start Update Order -----------');
    const order = await Models.Orders.update(
      { status },
      {
        where: { id },
      },
    );
    logger.info('--------- End Update Order -----------');
    return res
      .status(201)
      .json(ResponseSchema('Order Updated Successfully', true, order));
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
    logger.info('--------- Start Get All Orders -----------');
    const sendedObject = await Services?.Orders?.getAllItems(req);

    logger.info('--------- End Get All Orders Successfully -----------');
    return res.status(201).json(ResponseSchema('Orders', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Orders File Due To: ${err} -------------`,
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

exports.getSingleItem = async (req, res) => {
  try {
    logger.info('--------- Start Get Order -----------');
    const sendedObject = await Services?.Orders?.getSingleItem(req);
    logger.info('--------- End Get Order Successfully -----------');
    return res.status(201).json(ResponseSchema('Order', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Order Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getAllItemsWithPagination = async (req, res) => {
  try {
    const sendedObject = await Services?.Orders?.getAllItemsWithPagination(req);
    logger.info('--------- End Get All Orders Successfully -----------');
    return res.status(201).json(ResponseSchema('Orders', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Orders File Due To: ${err} -------------`,
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

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('--------- Start Delete Order -----------');
    await Models.Orders.destroy({
      where: { id },
    });
    logger.info('--------- End Delete Order -----------');
    return res
      .status(201)
      .json(ResponseSchema('Order Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Delete Order Due To: ${err} -------------`,
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
