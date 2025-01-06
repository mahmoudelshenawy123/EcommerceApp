const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');
const { PaginateSchema } = require('../../helper/HelperFunctions');

exports.getProduct = async (req, res) => {
  try {
    // const token = req?.headers?.authorization?.split(' ')?.[1];
    // const authedUser = jwt.decode(token);
    const { id } = req.params;
    const product = await Models.Products.findByPk(id, {
      include: [
        {
          model: Models.Providers,
          as: 'provider',
        },
        {
          model: Models.Categories,
          as: 'category',
        },
      ],
    });

    const sendedObject = {
      ...product.toJSON(),
      main_image: product?.getMainImageWithBaseUrl(req),
      images: product?.getImagesWithBaseUrl(req),
      // stories: user?.stories?.map((story) => ({
      //   ...story.toJSON(),
      //   image: story?.getImageWithBaseUrl(req),
      // })),
    };
    logger.info('--------- End Get All Products Successfully -----------');
    return sendedObject;
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const { name } = req.query;
    const query = {};
    if (name) query.name = name;
    const products = await Models.Products.findAll({
      where: query,
      include: [
        {
          model: Models.Providers,
          as: 'provider',
        },
        {
          model: Models.Categories,
          as: 'category',
        },
      ],
    });

    const sendedObject = products?.map((product) => {
      return {
        ...product.toJSON(),
        main_image: product?.getMainImageWithBaseUrl(req),
        images: product?.getImagesWithBaseUrl(req),
      };
    });
    logger.info('--------- End Get All Products Successfully -----------');
    return sendedObject;
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.getAllItemsWithPagination = async (req, res) => {
  try {
    const { name, limit, page } = req.query;

    const pageNo = Number(page) - 1 || 0;
    const itemPerPage = Number(limit) || 10;
    const offset = pageNo * itemPerPage;
    // const count = await GetCagtegoriesCount();

    const query = {};
    if (name) query.name = name;

    logger.info('--------- Start Get All Products -----------');
    const products = await Models.Products.findAndCountAll({
      where: query,
      limit,
      offset: offset,
    });
    const pages = Math.ceil((products?.count || 0) / itemPerPage);

    const sendedObject = products?.rows?.map((product) => {
      return {
        ...product.toJSON(),
        main_image: product?.getMainImageWithBaseUrl(req),
        images: product?.getImagesWithBaseUrl(req),
      };
    });
    return PaginateSchema(pageNo + 1, pages, products?.count, sendedObject);
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};
