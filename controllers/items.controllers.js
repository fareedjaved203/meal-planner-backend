import Item from "../models/items.model.js";

const postItem = async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    console.log(items);
    if (items) {
      return res
        .status(200)
        .json({ success: true, message: "items fetched", items });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const getSingleItem = async (req, res) => {
  try {
    const item = await Item.find({ pid: req.params.id });
    if (item) {
      return res
        .status(200)
        .json({ success: true, message: "item fetched", item });
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ pid: req.params.id });
    await item.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "item Deleted Successfully" });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.find({ pid: req.params.id });
    if (item) {
      item.status = req.body.status;
    }
    await item.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "item Updated", item });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, error);
  }
};

export { postItem, getItems, updateItem, getSingleItem, deleteItem };
