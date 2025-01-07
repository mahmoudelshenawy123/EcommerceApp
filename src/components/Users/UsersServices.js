const jwt = require('jsonwebtoken');

const { Models } = require('@src/config/Models');
const { PaginateSchema } = require('@src/helper/HelperFunctions');
const { LogInfo, LogError } = require('@src/helper/HelperFunctions');

exports.getUser = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    const authedUser = jwt.decode(token);
    const user = await Models.User.findByPk(authedUser?.user_id, {
      include: [
        {
          model: Models.Stories,
          as: 'stories',
        },
      ],
    });

    const sendedObject = {
      ...user.toJSON(),
      image: user?.getImageWithBaseUrl(req),
      stories: user?.stories?.map((story) => ({
        ...story.toJSON(),
        image: story?.getImageWithBaseUrl(req),
      })),
    };
    LogInfo('--------- End Get All Users Successfully -----------');
    return sendedObject;
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { name } = req.query;
    const query = {};
    if (name) query.name = name;
    const users = await Models.User.findAll({
      where: query,
      include: [
        {
          model: Models.Stories,
          as: 'stories',
        },
      ],
    });

    const sendedObject = users?.map((user) => {
      return {
        ...user.toJSON(),
        image: user.getImageWithBaseUrl(req),
      };
    });
    LogInfo('--------- End Get All Users Successfully -----------');
    return sendedObject;
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.getAllUsersWithPagination = async (req, res) => {
  try {
    const { name, limit, page } = req.query;

    const pageNo = Number(page) - 1 || 0;
    const itemPerPage = Number(limit) || 10;
    const offset = pageNo * itemPerPage;
    // const count = await GetCagtegoriesCount();

    const query = {};
    if (name) query.name = name;

    LogInfo('--------- Start Get All Users -----------');
    const users = await Models.User.findAndCountAll({
      where: query,
      limit,
      offset: offset,
    });
    const pages = Math.ceil((users?.count || 0) / itemPerPage);

    const sendedObject = users?.rows?.map((user) => {
      return {
        ...user.toJSON(),
        image: user.getImageWithBaseUrl(req),
      };
    });
    return PaginateSchema(pageNo + 1, pages, users?.count, sendedObject);
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

    LogInfo('--------- Start Add Story -----------');
    const story = await Models.Stories.create({
      user_id: authedUser?.user_id,
      title,
      image: storyImage ? storyImage.filename : null,
    });
    LogInfo('--------- End Add Story -----------');
    return story;
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Story Due To: ${err} -------------`);
    throw new Error(`Error On Add Story Due To: ${err}`);
  }
};
