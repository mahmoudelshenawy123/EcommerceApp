const jwt = require('jsonwebtoken');
const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');
const { PaginateSchema } = require('../../helper/HelperFunctions');

exports.getUser = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    const authedUser = jwt.decode(token);
    const user = await Models.AdminUsers.findByPk(authedUser?.user_id);

    const sendedObject = {
      ...user?.toJSON(),
      image: user?.getImageWithBaseUrl(req),
    };
    logger.info('--------- End Get All Users Successfully -----------');
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
    const users = await Models.AdminUsers.findAll({
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
    logger.info('--------- End Get All Users Successfully -----------');
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

    logger.info('--------- Start Get All Users -----------');
    const users = await Models.AdminUsers.findAndCountAll({
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
