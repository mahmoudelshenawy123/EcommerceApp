const { LogInfo, LogError } = require('@src/helper/HelperFunctions');
const { Models } = require('@src/config/Models');
const { Services } = require('@src/config/Services');
const { ErrorHandler } = require('@src/helper/ErrorHandler');
const { ResponseSchema } = require('@src/helper/HelperFunctions');

exports.createCategory = async (req, res) => {
  try {
    const { title, status } = req.body;
    const image = req.file;

    LogInfo('--------- Start Add Category -----------');
    const category = await Models.Categories.create({
      title,
      status,
      image: image ? image.filename : null,
    });
    LogInfo('--------- End Add Category -----------');
    return res
      .status(201)
      .json(ResponseSchema('Category Added Successfully', true, category));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Add Category Due To: ${err} -------------`);
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

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, image: imageLink } = req.body;
    const image = req.file;

    LogInfo('--------- Start Update Category -----------');
    const category = await Models.Categories.update(
      {
        title,
        status,
        image: image ? image.filename : imageLink,
      },
      {
        where: { id },
      },
    );
    LogInfo('--------- End Update Category -----------');
    return res
      .status(201)
      .json(ResponseSchema('Category Updated Successfully', true, category));
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
    LogInfo('--------- Start Get All Categories -----------');
    const sendedObject = await Services?.Categories?.getAllItems(req);

    LogInfo('--------- End Get All Categories Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Categories', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(
      `---------- Error On Categories File Due To: ${err} -------------`,
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

exports.getCategory = async (req, res) => {
  try {
    LogInfo('--------- Start Get Category -----------');
    const sendedObject = await Services?.Categories?.getCategory(req);
    LogInfo('--------- End Get Category Successfully -----------');
    return res.status(201).json(ResponseSchema('Category', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(`---------- Error On Category Due To: ${err} -------------`);
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
      await Services?.Categories?.getAllItemsWithPagination(req);
    LogInfo('--------- End Get All Categories Successfully -----------');
    return res
      .status(201)
      .json(ResponseSchema('Categories', true, sendedObject));
  } catch (err) {
    console.log(err);
    LogError(
      `---------- Error On Categories File Due To: ${err} -------------`,
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

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    LogInfo('--------- Start Delete Category -----------');
    await Models.Categories.destroy({
      where: {
        id,
      },
    });
    LogInfo('--------- End Delete Category -----------');
    return res
      .status(201)
      .json(ResponseSchema('Category Deleted Successfully', true));
  } catch (err) {
    console.log(err);
    LogError(
      `---------- Error On Delete Category Due To: ${err} -------------`,
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
