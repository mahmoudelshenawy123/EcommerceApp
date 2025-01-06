const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');
const { PaginateSchema } = require('../../helper/HelperFunctions');

exports.getCategory = async (req, res) => {
  try {
    // const token = req?.headers?.authorization?.split(' ')?.[1];
    // const authedUser = jwt.decode(token);
    const { id } = req.params;
    const category = await Models.Categories.findByPk(id, {
      include: [
        {
          model: Models.Providers,
          as: 'providers',
        },
      ],
    });

    const sendedObject = {
      ...category.toJSON(),
      image: category?.getImageWithBaseUrl(req),
      // stories: user?.stories?.map((story) => ({
      //   ...story.toJSON(),
      //   image: story?.getImageWithBaseUrl(req),
      // })),
    };
    logger.info('--------- End Get All Categories Successfully -----------');
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
    const categories = await Models.Categories.findAll({
      where: query,
      include: [
        {
          model: Models.Providers,
          as: 'providers',
          include: {
            model: Models.Products,
            as: 'products',
          },
        },
      ],
    });

    const sendedObject = categories?.map((category) => {
      return {
        ...category.toJSON(),
        image: category.getImageWithBaseUrl(req),
      };
    });
    logger.info('--------- End Get All Categories Successfully -----------');
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

    logger.info('--------- Start Get All Categories -----------');
    const categories = await Models.Categories.findAndCountAll({
      where: query,
      limit,
      offset: offset,
    });
    const pages = Math.ceil((categories?.count || 0) / itemPerPage);

    const sendedObject = categories?.rows?.map((user) => {
      return {
        ...user.toJSON(),
        image: user.getImageWithBaseUrl(req),
      };
    });
    return PaginateSchema(pageNo + 1, pages, categories?.count, sendedObject);
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};
