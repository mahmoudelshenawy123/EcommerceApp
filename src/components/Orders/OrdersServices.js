const { logger } = require('../../config/logger');

const { Models } = require('../../config/Models');
const { PaginateSchema } = require('../../helper/HelperFunctions');

exports.getSingleItem = async (req, res) => {
  try {
    // const token = req?.headers?.authorization?.split(' ')?.[1];
    // const authedUser = jwt.decode(token);
    const { id } = req.params;
    const order = await Models.Orders.findByPk(id, {
      include: [
        {
          model: Models.User,
          as: 'user',
        },
        {
          model: Models.Providers,
          as: 'provider',
        },
        {
          model: Models.Products,
          as: 'products',
          through: {
            attributes: ['quantity'], // Include the quantity field from the join table
          },
        },
      ],
    });

    const sendedObject = {
      ...order?.toJSON(),
      user: {
        ...order?.user?.toJSON(),
        image: order?.user?.getImageWithBaseUrl(req),
      },
      provider: {
        ...order?.provider?.toJSON(),
        main_image: order?.provider?.getMainImageWithBaseUrl(req),
        images: order?.provider?.getImagesWithBaseUrl(req),
      },
      products: order?.products?.map((product) => ({
        ...product?.toJSON(),
        main_image: product?.getMainImageWithBaseUrl(req),
        images: product?.getImagesWithBaseUrl(req),
      })),
    };
    logger.info('--------- End Get All Orders Successfully -----------');
    return sendedObject;
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const orders = await Models.Orders.findAll({
      where: query,
      include: [
        {
          model: Models.User,
          as: 'user',
        },
        {
          model: Models.Providers,
          as: 'provider',
        },
        {
          model: Models.Products,
          as: 'products',
          through: {
            attributes: ['quantity'], // Include the quantity field from the join table
          },
        },
      ],
    });
    const sendedObject = orders?.map((order) => {
      return {
        ...order.toJSON(),
        user: {
          ...order?.user.toJSON(),
          image: order?.user?.getImageWithBaseUrl(req),
        },
        provider: {
          ...order?.provider.toJSON(),
          main_image: order?.provider?.getMainImageWithBaseUrl(req),
          images: order?.provider?.getImagesWithBaseUrl(req),
        },
        products: order?.products?.map((product) => ({
          ...product.toJSON(),
          main_image: product?.getMainImageWithBaseUrl(req),
          images: product?.getImagesWithBaseUrl(req),
        })),
      };
    });
    logger.info('--------- End Get All Orders Successfully -----------');
    return sendedObject;
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};

exports.getAllItemsWithPagination = async (req, res) => {
  try {
    const { status, limit, page } = req.query;

    const pageNo = Number(page) - 1 || 0;
    const itemPerPage = Number(limit) || 10;
    const offset = pageNo * itemPerPage;
    // const count = await GetCagtegoriesCount();

    const query = {};
    if (status) query.status = status;

    logger.info('--------- Start Get All Orders -----------');
    const orders = await Models.Orders.findAndCountAll({
      where: query,
      limit,
      offset: offset,
    });
    const pages = Math.ceil((orders?.count || 0) / itemPerPage);

    const sendedObject = orders?.rows?.map((order) => {
      return {
        ...order.toJSON(),
        // user: {
        //   ...order?.user.toJSON(),
        //   image: order?.user?.getImageWithBaseUrl(req),
        // },
        // provider: {
        //   ...order?.provider.toJSON(),
        //   main_image: order?.provider?.getMainImageWithBaseUrl(req),
        //   images: order?.provider?.getImagesWithBaseUrl(req),
        // },
        // products: order?.products?.map((product) => ({
        //   ...product.toJSON(),
        //   main_image: product?.getMainImageWithBaseUrl(req),
        //   images: product?.getImagesWithBaseUrl(req),
        // })),
      };
    });
    return PaginateSchema(pageNo + 1, pages, orders?.count, sendedObject);
  } catch (err) {
    console.log(err);
    throw new Error(`Somethings Went wrong Due To :${err.message}`);
  }
};
