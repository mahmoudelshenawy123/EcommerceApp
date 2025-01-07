const { LogInfo } = require('@src/helper/HelperFunctions');

const { Models } = require('@src/config/Models');
const { PaginateSchema } = require('@src/helper/HelperFunctions');

exports.getProduct = async (req, res) => {
  try {
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
    };
    LogInfo('--------- End Get All Products Successfully -----------');
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
    LogInfo('--------- End Get All Products Successfully -----------');
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

    const query = {};
    if (name) query.name = name;

    LogInfo('--------- Start Get All Products -----------');
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
