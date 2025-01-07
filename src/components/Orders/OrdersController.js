const { LogInfo, LogError } = require('@src/helper/HelperFunctions');

const { Models } = require('@src/config/Models');
const { Services } = require('@src/config/Services');
const { ErrorHandler } = require('@src/helper/ErrorHandler');
const { ResponseSchema } = require('@src/helper/HelperFunctions');

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

    LogInfo('--------- Start Add Order -----------');
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
    LogInfo('--------- End Add Order -----------');
    return res
      .status(201)
      .json(ResponseSchema('Order Added Successfully', true, order));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Order Due To: ${err} -------------`);
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

    LogInfo('--------- Start Update Order -----------');
    const order = await Models.Orders.update(
      { status },
      {
        where: { id },
      },
    );
    LogInfo('--------- End Update Order -----------');
    return res
      .status(201)
      .json(ResponseSchema('Order Updated Successfully', true, order));
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

exports.getAllItems = async (req, res) => {
  try {
    LogInfo('--------- Start Get All Orders -----------');
    const sendedObject = await Services?.Orders?.getAllItems(req);

    LogInfo('--------- End Get All Orders Successfully -----------');
    return res.status(201).json(ResponseSchema('Orders', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Orders File Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getSingleItem = async (req, res) => {
  try {
    LogInfo('--------- Start Get Order -----------');
    const sendedObject = await Services?.Orders?.getSingleItem(req);
    LogInfo('--------- End Get Order Successfully -----------');
    return res.status(201).json(ResponseSchema('Order', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Order Due To: ${err} -------------`);
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
    LogInfo('--------- End Get All Orders Successfully -----------');
    return res.status(201).json(ResponseSchema('Orders', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Orders File Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    LogInfo('--------- Start Delete Order -----------');
    await Models.Orders.destroy({
      where: { id },
    });
    LogInfo('--------- End Delete Order -----------');
    return res
      .status(201)
      .json(ResponseSchema('Order Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Delete Order Due To: ${err} -------------`);
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
