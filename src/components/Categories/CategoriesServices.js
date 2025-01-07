const { LogInfo } = require('@src/helper/HelperFunctions');
const { Models } = require('@src/config/Models');
const { PaginateSchema } = require('@src/helper/HelperFunctions');

exports.getCategory = async (req, res) => {
  try {
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
    };
    LogInfo('--------- End Get All Categories Successfully -----------');
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
    LogInfo('--------- End Get All Categories Successfully -----------');
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

    LogInfo('--------- Start Get All Categories -----------');
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
