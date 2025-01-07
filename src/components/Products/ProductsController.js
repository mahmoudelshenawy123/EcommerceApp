const { LogInfo, LogError } = require('@src/helper/HelperFunctions');
const { Models } = require('@src/config/Models');
const { Services } = require('@src/config/Services');
const { ErrorHandler } = require('@src/helper/ErrorHandler');
const { ResponseSchema } = require('@src/helper/HelperFunctions');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, provider_id, category_id, status } =
      req.body;
    const { main_image, images } = req.files;

    LogInfo('--------- Start Add Product -----------');
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
    LogInfo('--------- End Add Product -----------');
    return res
      .status(201)
      .json(ResponseSchema('Product Added Successfully', true, product));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Product Due To: ${err} -------------`);
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

    LogInfo('--------- Start Update Product -----------');
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
    LogInfo('--------- End Update Product -----------');
    return res
      .status(201)
      .json(ResponseSchema('Product Updated Successfully', true, product));
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
    LogInfo('--------- Start Get All Products -----------');
    const sendedObject = await Services?.Products?.getAllItems(req);

    LogInfo('--------- End Get All Products Successfully -----------');
    return res.status(201).json(ResponseSchema('Products', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Products File Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.getProduct = async (req, res) => {
  try {
    LogInfo('--------- Start Get Product -----------');
    const sendedObject = await Services?.Products?.getProduct(req);
    LogInfo('--------- End Get Product Successfully -----------');
    return res.status(201).json(ResponseSchema('Product', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Product Due To: ${err} -------------`);
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
    LogInfo('--------- End Get All Products Successfully -----------');
    return res.status(201).json(ResponseSchema('Products', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Products File Due To: ${err} -------------`);
    return res
      .status(400)
      .json(
        ResponseSchema(`Somethings Went wrong Due To :${err.message}`, false),
      );
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    LogInfo('--------- Start Delete Product -----------');
    await Models.Products.destroy({
      where: { id },
    });
    LogInfo('--------- End Delete Product -----------');
    return res
      .status(201)
      .json(ResponseSchema('Product Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Delete Product Due To: ${err} -------------`);
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
