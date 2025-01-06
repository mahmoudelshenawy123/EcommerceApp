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

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, provider_id, category_id, status } =
      req.body;
    const { main_image, images } = req.files;

    logger.info('--------- Start Add Product -----------');
    const product = await Models.Products.create({
      title,
      description,
      status,
      price,
      provider_id,
      category_id,
      images: images?.map((image) => image?.filename),
      main_image: main_image ? main_image?.[0]?.filename : null,
    });
    // const provider = await Models.Providers.findByPk(provider_id);
    // provider.addProducts(product);
    logger.info('--------- End Add Product -----------');
    return res
      .status(201)
      .json(ResponseSchema('Product Added Successfully', true, product));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Add Product Due To: ${err} -------------`,
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      category_id,
      status,
      main_image: mainImageLink,
    } = req.body;
    const { main_image, images } = req.files;

    logger.info('--------- Start Update Product -----------');
    const product = await Models.Products.update(
      {
        title,
        description,
        status,
        price,
        category_id,
        main_image: main_image ? main_image?.[0]?.filename : mainImageLink,
        images: images?.map((image) => image?.filename),
      },
      {
        where: { id },
      },
    );
    logger.info('--------- End Update Product -----------');
    return res
      .status(201)
      .json(ResponseSchema('Product Updated Successfully', true, product));
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
    logger.info('--------- Start Get All Products -----------');
    const sendedObject = await Services?.Products?.getAllItems(req);

    logger.info('--------- End Get All Products Successfully -----------');
    return res.status(201).json(ResponseSchema('Products', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Products File Due To: ${err} -------------`,
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

exports.getProduct = async (req, res) => {
  try {
    logger.info('--------- Start Get Product -----------');
    const sendedObject = await Services?.Products?.getProduct(req);
    logger.info('--------- End Get Product Successfully -----------');
    return res.status(201).json(ResponseSchema('Product', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Product Due To: ${err} -------------`);
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
      await Services?.Products?.getAllItemsWithPagination(req);
    logger.info('--------- End Get All Products Successfully -----------');
    return res.status(201).json(ResponseSchema('Products', true, sendedObject));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Products File Due To: ${err} -------------`,
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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('--------- Start Delete Product -----------');
    await Models.Products.destroy({
      where: { id },
    });
    logger.info('--------- End Delete Product -----------');
    return res
      .status(201)
      .json(ResponseSchema('Product Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    logger.error(
      `---------- Error On Delete Product Due To: ${err} -------------`,
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
