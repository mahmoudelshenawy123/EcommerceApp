const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');
const { PaginateSchema } = require('../../helper/HelperFunctions');

exports.getSingleItem = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    const authedUser = jwt.decode(token);
    const provider = await Models.Providers.findByPk(authedUser?.user_id, {
      include: [
        {
          model: Models.ProvidersStories,
          as: 'stories',
        },
        {
          model: Models.Categories,
          as: 'categories',
        },
      ],
    });

    const sendedObject = {
      ...provider.toJSON(),
      main_image: provider?.getMainImageWithBaseUrl(req),
      images: provider?.getImagesWithBaseUrl(req),
      stories: provider?.stories?.map((story) => ({
        ...story.toJSON(),
        image: story?.getImageWithBaseUrl(req),
      })),
    };
    logger.info('--------- End Get All Providers Successfully -----------');
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
    const providers = await Models.Providers.findAll({
      where: query,
      include: [
        {
          model: Models.ProvidersStories,
          as: 'stories',
        },
        {
          model: Models.Categories,
          as: 'categories',
        },
        {
          model: Models.Products,
          as: 'products',
        },
      ],
    });

    const sendedObject = providers?.map((provider) => {
      return {
        ...provider.toJSON(),
        main_image: provider?.getMainImageWithBaseUrl(req),
        images: provider?.getImagesWithBaseUrl(req),
        stories: provider?.stories?.map((story) => ({
          ...story.toJSON(),
          image: story?.getImageWithBaseUrl(req),
        })),
      };
    });
    logger.info('--------- End Get All Providers Successfully -----------');
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

    logger.info('--------- Start Get All Providers -----------');
    const providers = await Models.Providers.findAndCountAll({
      where: query,
      limit,
      offset: offset,
    });
    const pages = Math.ceil((providers?.count || 0) / itemPerPage);
    const sendedObject = providers?.rows?.map((provider) => {
      return {
        ...provider.toJSON(),
        main_image: provider?.getMainImageWithBaseUrl(req),
        images: provider?.getImagesWithBaseUrl(req),
      };
    });

    return PaginateSchema(pageNo + 1, pages, providers?.count, sendedObject);
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.addStory = async (req, res) => {
  try {
    const { title } = req.body;
    const token = req?.headers?.authorization?.split(' ')?.[1];
    const authedUser = jwt.decode(token);
    const storyImage = req.file;

    logger.info('--------- Start Add Story -----------');
    const story = await Models.ProvidersStories.create({
      provider_id: authedUser?.user_id,
      title,
      image: storyImage ? storyImage.filename : null,
    });
    logger.info('--------- End Add Story -----------');
    return story;
  } catch (err) {
    console.log(err);
    logger.error(`---------- Error On Add Story Due To: ${err} -------------`);
    throw new Error(`Error On Add Story Due To: ${err}`);
  }
};
